// ==UserScript==
// @name         DGS Utilities
// @description  Improvements of dragongoserver.net: conditional moves, grey skin, keyboard shortcuts.
// @author       TPReal
// @namespace    https://greasyfork.org/users/9113
// @version      0.4.8
// @match        *://www.dragongoserver.net/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13669/DGS%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/13669/DGS%20Utilities.meta.js
// ==/UserScript==

/* jshint ignore:start */
(()=>{
'use strict';

const EXTRA_CSS=`\
table.MessageForm textarea[name='message'] {
  height: 2.5em;
}

div#condMoves {
  margin: 1em;
}

div#condMoves input {
  width: 35em;
  margin-left: 0.5em;
}

div#condMoves > * {
  vertical-align: baseline;
}

span.game-info-char {
  font-size: 0.8em;
}

div#loadingInfo {
  position: fixed;
  bottom: 0;
  left: 0;
  background: #0c41c9;
  color: #fffc70;
  margin: 8px;
  padding: 0 0.3em;
  display: none;
}

table#PoolViewerTable td.Matrix > a[title~="[Timeout]"]::after {
  content: "T";
  font-size: 0.5em;
}
`;

const SKIN_GREY=`\
body {
  background: #f8f8f8;
  font-family: Georgia, Times, Times New Roman, serif;
}

table#pageHead, table#pageFoot {
  border: solid 1px #707070;
  background: #d0d0d0;
  color: #202020;
  margin-top: -2px;
}

table#pageHead a, table#pageFoot a {
  color: #202020;
}

table#pageMenu {
  background: #f8f8f8;
  border-color: #707070;
}

span.MainMenuCount {
  color: #a0a0a0;
}

table.GameInfos tr {
  background: #eeeeee;
}

table.Links a {
  color: #202020;
}

a[target] {
  color: initial;
}

a {
  color: initial;
}

table.Goban img.brdl, table.Goban img.brdn, table.Goban img[src='images/blank.gif'] {
  filter: grayscale() brightness(102%);
}

td.Logo1 img[alt='Dragon'] {
  filter: grayscale() brightness(101%);
}

img[alt='Dragon Go Server'] {
  filter: grayscale() brightness(68.5%) contrast(300%);
}

img[alt='Samuraj Logo'] {
  filter: grayscale() brightness(97%);
  margin-top: -10px;
}

img[alt='Rating graph'] {
  filter: grayscale();
}

table.Table tr.Row2, table.Table tr.Row4 {
  background: #f4f4f4;
}

table.Table tr.Row1 td.RemTimeWarn2, table.Table tr.Row2 td.RemTimeWarn2,
table.Table tr.Row3 td.RemTimeWarn2, table.Table tr.Row4 td.RemTimeWarn2 {
  background: initial;
}

table.Table tr.Row1 td.RemTimeWarn1, table.Table tr.Row2 td.RemTimeWarn1,
table.Table tr.Row3 td.RemTimeWarn1, table.Table tr.Row4 td.RemTimeWarn1 {
  background: #fa96a6;
}

h3.Header, h3.Header .Rating, h3.Header .User {
  color: initial;
}

table.Infos, table.InfoBox, table.MessageBox {
  border-collapse: collapse;
  border-color: #707070;
}

table.Infos td, table.InfoBox td, table.MessageBox td, table.Infos th, table.Infos td {
  border-color: #707070;
}

img[alt='RSS'] {
  display: none;
}

font[color] {
  color: initial;
}

table.Table td.Sgf a {
  color: initial;
}

td.ServerHome {
  color: rgba(0,0,0,0);
}

td.ServerHome select, td.ServerHome input {
  display: none;
}

table#PoolViewerTable tr.Empty, table#PoolViewerTable tr.Title {
  background: initial;
}

dl.ExtraInfos dd.Guidance, dl.ExtraInfos dd.Info {
  color: initial;
}

table.Infos th {
  color: initial;
}

table.GameNotes th {
  background: #d0d0d0;
  color: initial;
}

div#loadingInfo {
  background: #d0d0d0;
  color: #202020;
  border: solid 1px #707070;
}
`;

const RELOAD_INTERVAL=10*60*1000;

class LoadingIndicator{

  constructor(){
    this.counter_=0;
    this.element_=null;
  }

  static create(){
    return new LoadingIndicator();
  }

  init(){
    this.element_=document.createElement("div");
    this.element_.id="loadingInfo";
    this.element_.title="Working...";
    this.element_.innerHTML="...";
    document.body.appendChild(this.element_);
    this.setVisibility_();
  }

  registerPromise(loadingPromise){
    this.counter_++;
    this.setVisibility_();
    loadingPromise.catch(()=>null).then(()=>{
      setTimeout(()=>{
        this.counter_--;
        this.setVisibility_();
      },10);
    });
    return loadingPromise;
  }

  registerStart(){
    let done;
    this.registerPromise(new Promise(success=>{
      done=()=>success(null);
    }));
    return done;
  }

  setVisibility_(){
    if(this.element_)
      this.element_.style.display=this.counter_?"block":null;
  }

}

const LOADING_INDICATOR=LoadingIndicator.create();

async function ajax(path,params={},init={}){
  const searchParams=new URLSearchParams();
  for(const param of Object.keys(params))
    searchParams.set(param,params[param]);
  const paramsStr=searchParams.toString();
  const done=LOADING_INDICATOR.registerStart();
  try{
    const response=await fetch(
      `${path}${paramsStr?`?${paramsStr}`:``}`,
      Object.assign({credentials:"include"},init));
    return response.ok?response.text():Promise.reject(response);
  }finally{
    done();
  }
}

class ParseError extends Error{}

const coord={

  SGFPattern:"[a-s]{2}",

  fromSGF(str){
    if(!str.match(/^[a-s]{2}$/))
      throw new Error(`Bad SGF coordinates format: ${str}`);
    const x=str.charCodeAt(0)-96;
    const y=str.charCodeAt(1)-96;
    return `${String.fromCharCode((x>=9?x+1:x)+96)}${20-y}`;
  },

  validate(str){
    if(!str.match(/^[a-hj-t]([1-9]|1[0-9])$/))
      throw new ParseError(`Bad move coordinates: ${str||"(empty)"}`);
  },

  toSGF(str){
    this.validate(str);
    let xc=str.charCodeAt(0)-96;
    const x=xc>=9?xc-1:xc;
    const y=20-parseInt(str.substr(1),10);
    return String.fromCharCode(x+96,y+96);
  },

};

class CondMoves{

  constructor(gameId,atMoveNo,tree={}){
    this.gameId=gameId;
    this.atMoveNo=atMoveNo;
    this.tree=tree;
  }

  static parseUserString(gameId,atMoveNo,str){
    const condMoves=new CondMoves(gameId,atMoveNo);
    for(const path of str.trim().split(/\s*[,;\n]\s*/)){
      if(!path)
        continue;
      const moves=path.split(/\s+/);
      for(const move of moves)
        coord.validate(move);
      if(moves.length%2!==0)
        throw new ParseError(`Path with odd length (no response specified for opponent's last move): ${moves.join(" ")}`);
      let cm=condMoves;
      for(let i=0;i<moves.length;i+=2){
        const branch=cm.getBranch_(moves[i],moves[i+1]);
        cm=branch.condMoves;
      }
    }
    return condMoves;
  }

  getBranch_(move,response){
    let branch=this.tree[move];
    if(branch&&branch.response!==response)
      throw new ParseError(`Inconsistent response to ${move} in different branches: ${branch.response} vs ${response}`);
    if(!branch){
      branch={response,condMoves:new CondMoves(this.gameId,this.atMoveNo+2)};
      this.tree[move]=branch;
    }
    return branch;
  }

  hasMoves(){
    return !!Object.keys(this.tree).length;
  }

  toUserString(){
    return this.toUserStringHelper_().map(path=>path.join(" ")).join(", ");
  }

  toUserStringHelper_(){
    const paths=[];
    if(this.hasMoves()){
      for(const move of Object.keys(this.tree)){
        const branch=this.tree[move];
        for(const path of branch.condMoves.toUserStringHelper_())
          paths.push([move,branch.response,...path]);
      }
    }else
      paths.push([]);
    return paths;
  }

  toString(){
    return `CondMoves[${this.gameId}@${this.atMoveNo}: ${this.toUserString()}]`;
  }

  serialise(){
    return `@${this.atMoveNo} ${this.toUserString()}`;
  }

  static deserialise(gameId,str){
    const mat=str.match(/^\s*@(\d+) (.*)$/);
    if(!mat)
      throw new Error(`Bad serialised conditional moves: ${str}`);
    return CondMoves.parseUserString(gameId,parseInt(mat[1],10),mat[2]);
  }

}

/*
class Storage{

  constructor(base,fieldsWithDefaults,serialiser=JSON){
    const serialise=(serialiser.serialise||serialiser.stringify).bind(serialiser);
    for(const field of Object.keys(fieldsWithDefaults)){
      const defVal=fieldsWithDefaults[field];
      Object.defineProperty(this,field,{
        get:()=>{
          const str=base.getItem(field);
          if(str===null)
            return defVal;
          return serialiser.parse(str);
        },
        set:v=>{
          base.setItem(field,serialise(v));
        },
      });
    }
  }

}

const LOCAL_STORAGE=new Storage(localStorage,{});
*/

class PrivateNotes{

  constructor(gameId,base,condMoves){
    this.gameId=gameId;
    this.base=base;
    this.condMoves=condMoves;
  }

  static parse(gameId,text){
    const mat=text.match(/^([\s\S]*?)(?:(?:^|\n)Conditional moves: (.+)\n*)?$/);
    let base=mat[1];
    let condMoves=null;
    if(mat[2])
      try{
        condMoves=CondMoves.deserialise(gameId,mat[2]);
        if(!(condMoves instanceof CondMoves))
          throw new Error(`Expected CondMoves, got ${condMoves}`);
      }catch(e){
        console.warn(`Cannot parse conditional moves from private notes: ${mat[2]}, error: ${e}`);
        base=mat[0];
        condMoves=null;
      }
    base=base.trim();
    if(base)
      base+="\n";
    return new PrivateNotes(gameId,base,condMoves);
  }

  static empty(gameId){
    return new PrivateNotes(gameId,"",null);
  }

  async saveCondMoves(condMoves){
    this.condMoves=condMoves;
    let text=this.base;
    if(condMoves&&condMoves.hasMoves())
      text+=`\n\n\nConditional moves: ${condMoves.serialise()}\n`;
    await ajax("/quick_do.php",{
      obj:"game",
      cmd:"save_notes",
      gid:this.gameId,
      notes:text,
    });
    ajax("/quick_do.php",{
      obj:"game",
      cmd:"hide_notes",
      gid:this.gameId,
    });
  }

  toString(){
    return `PrivateNotes[condMoves=${this.condMoves}]`;
  }

}

class GameSGF{

  constructor(gameId,moveNo,lastMove,privateNotes,hasExtraComments){
    this.gameId=gameId;
    this.moveNo=moveNo;
    this.lastMove=lastMove;
    this.privateNotes=privateNotes;
    this.hasExtraComments=hasExtraComments;
  }

  get condMoves(){
    return this.privateNotes&&this.privateNotes.condMoves;
  }

  static parse(gameId,sgf){
    const nodes=sgf.split("\n;").slice(1);
    const firstNodeTags=GameSGF.parseTags_(nodes[0]);
    const moveNo=firstNodeTags.XM?parseInt(firstNodeTags.XM,10):null;
    const lastNodeTags=GameSGF.parseTags_(nodes[nodes.length-1]);
    const lastMoveSGF=lastNodeTags.B||lastNodeTags.W;
    const lastMove=lastMoveSGF?coord.fromSGF(lastMoveSGF):null;
    const lastMoveComment=lastNodeTags.C;
    let privateNotes=null;
    let hasExtraComments=false;
    if(lastMoveComment){
      const nMat=lastMoveComment.match(/(?:^|\n)Notes - .+? \(.+?\):\n([\s\S]*)/);
      if(nMat){
        privateNotes=PrivateNotes.parse(gameId,nMat[1]);
        hasExtraComments=nMat[0].trim()!==lastMoveComment.trim();
      }else
        hasExtraComments=true;
    }
    return new GameSGF(gameId,moveNo,lastMove,privateNotes,hasExtraComments);
  }

  static async load(gameId,allowCache=false){
    return GameSGF.parse(gameId,await ajax("/sgf.php",{
      gid:gameId,
      owned_comments:1,
      quick_mode:1,
      no_cache:allowCache?0:1,
    }));
  }

  static parseTags_(node){
    const regexp=/([A-Z]{1,2})\[/g;
    const result={};
    for(;;){
      const mat=regexp.exec(node);
      if(!mat)
        break;
      let value="";
      let i=regexp.lastIndex;
      for(;;){
        if(i>=node.length)
          break;
        if(node[i]==="]"&&!(i+1<node.length&&node[i+1]==="["))
          break;
        if(node[i]==="\\"&&i+1<node.length&&(node[i+1]==="\\"||node[i+1]==="["))
          value+=node[++i];
        else
          value+=node[i];
        i++;
      }
      result[mat[1]]=value;
      regexp.lastIndex=i;
    }
    return result;
  }

  async executeCondMoves(){
    if(!this.condMoves||!this.moveNo||!this.lastMove)
      return {};
    const {clearCondMoves,condMoves:newCondMoves,response}=this.analyseCondMoves_();
    let condMovesToSave=clearCondMoves?null:newCondMoves;
    let promise;
    if(response){
      console.debug(`Responding in game ${this.gameId} to ${this.lastMove} with ${response}`);
      promise=ajax("/quick_do.php",{
        obj:"game",
        cmd:"move",
        gid:this.gameId,
        move_id:this.moveNo,
        move:coord.toSGF(response),
      },{method:"POST"}).then(()=>({responded:true}));
      promise.catch(error=>{
        console.warn(`Responding in game ${this.gameId} at move ${this.moveNo} with ${response} failed: ${error}`);
        condMovesToSave=null;
      });
    }else
      promise=Promise.resolve({});
    promise.catch(()=>null).then(()=>this.saveCondMoves(condMovesToSave));
    return promise;
  }

  analyseCondMoves_(){
    if(this.hasExtraComments){
      console.debug(`In game ${this.gameId} additional information is associated with last move; clearing conditional moves`);
      return {clearCondMoves:true};
    }
    if(this.moveNo!==this.condMoves.atMoveNo){
      console.debug(`In game ${this.gameId} current move is ${this.moveNo}, but conditional moves defined for move ${this.condMoves.atMoveNo}; clearing conditional moves`);
      return {clearCondMoves:true};
    }
    const branch=this.condMoves.tree[this.lastMove];
    if(!branch){
      console.debug(`In game ${this.gameId} no response defined for ${this.lastMove}; clearing conditional moves`);
      return {clearCondMoves:true};
    }
    return branch;
  }

  async checkCondMovesOnOpponentTurn(){
    if(!this.condMoves||!this.moveNo)
      return null;
    if(this.moveNo>this.condMoves.atMoveNo){
      console.debug(`In game ${this.gameId} current move is ${this.moveNo}, but conditional moves defined for move ${this.condMoves.atMoveNo}; clearing conditional moves`);
      return this.saveCondMoves(null);
    }
    return null;
  }

  async saveCondMoves(condMoves){
    if(!this.privateNotes)
      this.privateNotes=PrivateNotes.empty(this.gameId);
    return this.privateNotes.saveCondMoves(condMoves);
  }

  toString(){
    return `GameSGF[gameId=${this.gameId}, @${this.moveNo}, lastMove=${this.lastMove
       }, privateNotes=${this.privateNotes}, hasExtraComments=${this.hasExtraComments}]`;
  }

}

class QuickStatus{

  constructor(objects){
    this.objects_=objects;
  }

  static parse(status){
    const errMat=status.match(/\[#Error: (.+?)\]$/m);
    if(errMat)
      throw new Error(`QuickStatus parse error: ${errMat[1]}`);
    const objectsByType=new Map();
    const headersByType=new Map();
    const getFields=str=>{
      const fields=[];
      let field="";
      let quoted=false;
      for(let i=0;i<str.length;i++){
        if(str[i]==="'"){
          if(quoted)
            quoted=false;
          else if(field)
            throw new Error(`Unexpected quote in string: ${str}`);
          else
            quoted=true;
        }else if(str[i]==="\\"&&quoted){
          if(++i>=str.length)
            throw new Error(`Unexpected end of string: ${str}`);
          field+=str[i];
        }else if(str[i]===","&&!quoted){
          fields.push(field);
          field="";
        }else
          field+=str[i];
      }
      fields.push(field);
      return fields;
    };
    const scan=function*(str,regexp){
      let mat;
      while(mat=regexp.exec(str))
        yield mat;
    };
    for(const mat of scan(status,/^## ([A-Z]),(.+?)$/mg))
      headersByType.set(mat[1],getFields(mat[2]));
    for(const mat of scan(status,/^([A-Z]),(.+?)$/mg)){
      const type=mat[1];
      let objects=objectsByType.get(type);
      if(!objects){
        objects=[];
        objectsByType.set(type,objects);
      }
      const headers=headersByType.get(type);
      const fields=getFields(mat[2]);
      const object={};
      objects.push(object);
      for(let i=0;i<headers.length;i++)
        object[headers[i]]=fields[i];
    }
    return new QuickStatus(objectsByType);
  }

  static async load(){
    return QuickStatus.parse(await ajax("/quick_status.php",{version:2,no_cache:1,order:0}));
  }

  get messages(){
    return this.objects_.get("M")||[];
  }

  get games(){
    return this.objects_.get("G")||[];
  }

}

class TitleUpdater{

  constructor(base,initialCount){
    this.base_=base;
    this.initialCount_=initialCount;
  }

  static create(){
    const mat=document.title.match(/^(.+?)(?: \((\d+)\))?$/)
    return new TitleUpdater(mat[1],mat[2]||null);
  }

  quickUpdate(){
    this.updateInternal_(this.initialCount_,0);
  }

  update(quickStatus){
    this.updateInternal_(quickStatus.games.length,quickStatus.messages.length);
  }

  updateInternal_(gamesCount,messagesCount){
    document.title=`${gamesCount==null?``:`[${gamesCount}${messagesCount?`, ${messagesCount}`:``}] `}${this.base_}`;
  }

}

class Manager{

  constructor(titleUpdater){
    this.titleUpdater_=titleUpdater;
    this.quickStatus=null;
  }

  static start(){
    const titleUpdater=TitleUpdater.create();
    titleUpdater.quickUpdate();
    const manager=new Manager(titleUpdater);
    const update=async()=>{
      try{
        await manager.update();
      }finally{
        scheduleUpdate();
      }
    };
    const scheduleUpdate=()=>setTimeout(update,RELOAD_INTERVAL);
    scheduleUpdate();
    return manager;
  }

  async update(){
    if(location.pathname==="/index.php")
      return;
    if(location.pathname==="/status.php")
      location.reload();
    else{
      this.quickStatus=await QuickStatus.load();
      this.titleUpdater_.update(this.quickStatus);
      Promise.all(this.quickStatus.games.map(game=>
        GameSGF.load(game.game_id).then(sgf=>sgf.executeCondMoves()).catch(error=>{
          console.warn(`Error while executing conditional move for game ${gameId}: ${error}`);
          return {error};
        }))).then(results=>{
          if(results.some(result=>result.responded))
            this.update();
        });
    }
  }

}

function addCSS(css){
  const styleElem=document.createElement("style");
  styleElem.innerText=css;
  document.head.appendChild(styleElem);
}

async function start(){

  const COND_MOVES_TR_INNER_HTML=`\
<td class="UnderBoard">
  <div id="condMoves" title="Specify branches of conditional moves, e.g.: f3 c6 d2 c3, c6 f3
Right-click on board to enter coordinates">
    <span>Conditional moves:</span>
    <input id="condMoves" type="text">
    <button id="saveCondMoves" type="button">Save</button>
  </div>
</td>`;

  LOADING_INDICATOR.init();

  const manager=Manager.start();

  const keyHandlers=new Map();

  if(location.pathname==="/status.php"){
    Promise.all([...document.querySelectorAll("table#gameTable tr td.Button:first-child")].map(gameIdElem=>{
      const gameId=gameIdElem.innerText.trim();
      return GameSGF.load(gameId).then(sgf=>sgf.executeCondMoves()).catch(error=>{
        console.warn(`Error while executing conditional move for game ${gameId}: ${error}`);
        return {error};
      });
    })).then(results=>{
      if(results.some(result=>result.responded))
        location.reload();
    });
  }else if(location.pathname==="/game.php"){
    const gameId=location.searchParams.get("g")||location.searchParams.get("gid");
    let gameState;
    if(location.searchParams.get("a")==="domove")
      gameState="confirmMove";
    else if(location.searchParams.get("a")==="resign")
      gameState="resigning";
    else if(document.querySelector("dl.ExtraInfos dd.Score"))
      gameState="finished";
    else if(document.querySelector("input[name='action'][value='choose_move']"))
      gameState="myMove";
    else
      gameState="theirMove";

    const eidogoLinkImg=document.querySelector("a.NoPrint > img[title='EidoGo Game Player']");
    if(eidogoLinkImg)
      eidogoLinkImg.parentElement.setAttribute("target","_blank");

    if(gameState==="confirmMove"){
      const linkifyField=(imageElement,href)=>{
        if(!imageElement)
          return;
        const td=imageElement.parentElement;
        const link=document.createElement("a");
        link.setAttribute("href",href);
        link.appendChild(imageElement);
        td.appendChild(link);
      };
      const moveParams=new URLSearchParams(location.searchParams);
      for(const mark of [".",","]){
        for(const img of document.querySelectorAll(`table#Goban td[id].brdx img[alt='${mark}'].brdx`)){
          moveParams.set("c",img.parentElement.id);
          linkifyField(img,`/game.php?${moveParams}`);
        }
      }
      moveParams.delete("a");
      moveParams.delete("c");
      for(const mark of ["@","#"])
        linkifyField(document.querySelector(`table#Goban td[id].brdx img[alt='${mark}'].brdx`),`/game.php?${moveParams}`);

      const cancelMove=()=>document.querySelector("input[name='cancel']").click();
      keyHandlers.set("ArrowLeft",cancelMove);
      keyHandlers.set("Home",cancelMove);
      keyHandlers.set("End",cancelMove);
    }else{
      const navigate=(selOptFunc)=>{
        const selMoveOption=document.querySelector("select[name='gotomove'] option[selected]");
        if(!selMoveOption)
          return;
        const newMoveOption=selOptFunc(selMoveOption);
        if(newMoveOption&&newMoveOption!==selMoveOption){
          selMoveOption.removeAttribute("selected");
          newMoveOption.setAttribute("selected","");
          document.querySelector("input[name='movechange']").click();
        }
      };
      keyHandlers.set("ArrowLeft",()=>navigate(o=>o.nextElementSibling));
      keyHandlers.set("ArrowRight",()=>navigate(o=>o.previousElementSibling));
      keyHandlers.set("Home",()=>navigate(o=>o.parentElement.lastElementChild));
      keyHandlers.set("End",()=>navigate(o=>o.parentElement.firstElementChild));
    }

    if(gameState==="confirmMove"||(gameState==="theirMove"&&
        document.querySelector("select[name='gotomove'] option[selected]:first-of-type"))){
      const condMovesRow=document.createElement("tr");
      condMovesRow.innerHTML=COND_MOVES_TR_INNER_HTML;
      const summaryRow=document.querySelector("table#GamePage > tbody > tr:nth-of-type(2)");
      condMovesRow.querySelector("td").setAttribute("colspan",summaryRow.querySelector("td").getAttribute("colspan"));
      if(gameState==="confirmMove")
        condMovesRow.querySelector("#saveCondMoves").style.display="none";
      const condMovesInput=condMovesRow.querySelector("input#condMoves");
      summaryRow.parentElement.insertBefore(condMovesRow,summaryRow);
      const sgfPromise=GameSGF.load(gameId);
      sgfPromise.then(sgf=>{
        if(sgf.condMoves)
          condMovesInput.value=sgf.condMoves.toUserString();
      });
      const moveNoOffset=gameState==="confirmMove"?2:1;
      const saveCondMoves=()=>{
        const promise=sgfPromise.then(sgf=>{
          const condMoves=CondMoves.parseUserString(gameId,sgf.moveNo+moveNoOffset,condMovesInput.value);
          condMovesInput.value=condMoves.toUserString();
          return sgf.saveCondMoves(condMoves);
        });
        promise.catch(error=>{
          let msg;
          if(error instanceof ParseError)
            msg=`Invalid conditional moves: ${error.message}`;
          else
            msg=`Error saving conditional moves: ${error}`;
          console.warn(msg);
          alert(msg);
        });
        return promise;
      };
      condMovesRow.querySelector("#saveCondMoves").addEventListener("click",()=>{
        saveCondMoves();
        return true;
      });
      condMovesInput.addEventListener("keydown",event=>{
        if(event.code==="Enter"){
          saveCondMoves();
          event.preventDefault();
        }
      });
      const rightClickHandler=event=>{
        if(event.button===2){
          const move=coord.fromSGF(event.currentTarget.id);
          const text=condMovesInput.value;
          const focused=document.activeElement===condMovesInput;
          let selRange;
          if(focused)
            selRange=[text.length,text.length];
          else
            selRange=[condMovesInput.selectionStart,condMovesInput.selectionEnd];
          const preText=text.substring(0,selRange[0]);
          const postText=text.substring(selRange[1]);
          let newText=preText;
          if(preText.match(/\S$/))
            newText+=" ";
          newText+=move;
          const newCursorPos=newText.length;
          if(postText.match(/^[^,\s]/))
             newText+=" ";
          newText+=postText;
          condMovesInput.value=newText;
          condMovesInput.focus();
          condMovesInput.setSelectionRange(newCursorPos,newCursorPos);
          event.preventDefault();
        }
      };
      for(const field of document.querySelectorAll("table#Goban td[id].brdx")){
        field.addEventListener("mouseup",rightClickHandler);
        field.addEventListener("contextmenu",event=>event.preventDefault());
      }
      let allowedSubmitButton=null;
      const submitHandler=event=>{
        if(event.target===allowedSubmitButton)
          return;
        saveCondMoves().then(()=>{
          allowedSubmitButton=event.target;
          event.target.click();
        });
        event.preventDefault();
      };
      for(const name of ["nextgame","nextstatus"]){
        const button=document.querySelector(`input[type='submit'][name='${name}']`);
        if(button)
          button.addEventListener("click",submitHandler);
      }
    }

    keyHandlers.set("Space",()=>{
      const skipParams=new URLSearchParams();
      skipParams.set("gid",gameId);
      skipParams.set("nextskip","t");
      location.href=`/confirm.php?${skipParams}`;
    });
  }else if(location.pathname==="/show_games.php"){
    for(const gameIdElem of document.querySelectorAll("table#runningTable tr td.Button:first-child")){
      const infoElem=gameIdElem.parentElement.querySelector("td.ImagesLeft");
      if(infoElem){
        const gameId=gameIdElem.innerText.trim();
        GameSGF.load(gameId).then(sgf=>{
          return sgf.checkCondMovesOnOpponentTurn().then(()=>{
            if(sgf.privateNotes&&sgf.privateNotes.base.trim())
              infoElem.innerHTML+=` <span class="game-info-char" title="There are private notes saved for this game">(p)</span>`;
            if(sgf.condMoves)
              infoElem.innerHTML+=` <span class="game-info-char" title="Conditional moves are defined for this game">(c)</span>`;
          });
        });
      }
    }
  }else if(location.pathname==="/error.php")
    setTimeout(()=>location.href="/status.php",3600*1000);
  keyHandlers.set("Escape",()=>location.href=`/status.php`);

  if(keyHandlers.size){
    document.addEventListener("keydown",event=>{
      if(["INPUT","TEXTAREA"].includes(event.target.tagName))
        return;
      const code=event.code;
      const handler=keyHandlers.get(code);
      if(handler){
        event.preventDefault();
        handler();
      }
    });
  }

}

async function onLoaded(){
  addCSS(EXTRA_CSS);
  addCSS(SKIN_GREY);
  location.searchParams=new URLSearchParams(location.search);
  try{
    await start();
  }catch(e){
    console.error(e);
  }
}

if(document.readyState==="loading")
  document.addEventListener("DOMContentLoaded",onLoaded,false);
else
  onLoaded();

})();
