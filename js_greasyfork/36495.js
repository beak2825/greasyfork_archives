// ==UserScript==
// @name 314n.org improver
// @name:ru 314n.org improver
// @namespace 314n.org
// @version 1.0.2
// @match https://314n.org/*
// @match https://314n.ru/*
// @description Improves 314n.org user-expiriense.
// @description:ru Улучшает взаимодействие с 314n.org.
// @icon https://314n.org/f1.png
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @run-at document-end
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/36495/314norg%20improver.user.js
// @updateURL https://update.greasyfork.org/scripts/36495/314norg%20improver.meta.js
// ==/UserScript==

/*jshint esnext: true */

const TEXT_COLOR_RGB = 'rgb(95, 191, 255)';
const TEXT_COLOR_HEX = '#5FBFFF';
const TEXT_HIGHLIGHTED_COLOR = '#eee';
const EVENT_SUBMIT_ACCOUNT = 'event-submit-account';
const CLASS_BOARD_LINK = 'board-link';
const CLASS_THREAD_LINK = 'thread-link';

const CONTEXT_EMPTY = '';
const CONTEXT_LOGGED = 'logged';
const CONTEXT_BOARDS = 'boards';
const CONTEXT_BOARD = 'board';
const CONTEXT_TOPIC = 'topic';

var scriptElements = [];
var loginForm;
var regForm;
var log = console.log;
var ce = document.createElement.bind(document);
var cn = document.createTextNode.bind(document);
var boardEreg = /\[(\d+)\]\s+(.+)\s+/;
var bracketsEreg = /\[(\d+)\]/;
let underliner = (e)=>e.target.style.setProperty('text-decoration','underline');
let unUnderliner = (e)=>e.target.style.removeProperty('text-decoration');
let pointer = (e)=>e.target.style.cursor = 'pointer';
let unPointer = (e)=>e.target.style.removeProperty('cursor');
let textHighlight = (e)=>e.target.style.color = TEXT_HIGHLIGHTED_COLOR;
let unTextHighlight = (e)=>e.target.style.removeProperty('color');
var currentContext = '';
let commandsMap = new Map(); /* String -> Command*/
let checkCommandEReg = null;
let lastEreg = /last/i;
let lastPageNum = 9999;

$(document).ready(init);

function init(){
  
  initCommands();
  
  regForm = regEl(createRegForm());
  let reg = createPanelButton('reg', regForm.id);
  reg.addEventListener('click', showAccountForm);
  
  loginForm = regEl(createLoginForm());
  let login = createPanelButton('log-in', loginForm.id);
  login.addEventListener('click', showAccountForm);
  
  // create menu buttons wrapper
  let btnWrap = regEl(ce('div'));
  
  btnWrap.style.display = 'flex';
  btnWrap.style.setProperty('display','flex');
  btnWrap.style.setProperty('flex-flow','row nowrap');
  btnWrap.style.setProperty('justify-content','flex-start');
  btnWrap.style.position = 'absolute';
  btnWrap.style.bottom = '100%';
  btnWrap.style.right = '0';
  btnWrap.style.zIndex = '10';
  btnWrap.appendChild($(createPanelButton('boards')).click(e=>simulateInput('BOARDS')).get(0));
  btnWrap.appendChild(reg);
  btnWrap.appendChild(login);
  btnWrap.appendChild($(createPanelButton('log-out')).click(e => simulateInput('LOGOUT')).get(0));
  btnWrap.appendChild($(createPanelButton(' ? ')).click(e => simulateInput('HELP')).get(0));
  $('#board').append(btnWrap);
  $('#board').click(globalClick);
  
  reinitCmd();
  
  setTimeout(focusCmd, 1);
  
  currentContext = CONTEXT_EMPTY;
}

function initCommands(){
  
  // no args
  addCommand(new CommandHelp());
  addCommand(new CommandBoards());
  addCommand(new Command('LOGOUT'));
  addCommand(new CommandNav('NEXT'));
  addCommand(new CommandNav('PREV'));
  addCommand(new CommandNav('FIRST'));
  addCommand(new CommandNav('LAST'));
  addCommand(new CommandNav('REFRESH'));
  
  // one arg
  addCommand(new CommandTimezone());
  addCommand(new CommandBoard());
  addCommand(new CommandRvt());
  addCommand(new CommandReply());
  addCommand(new CommandOneArg('DELETE','p'));
  addCommand(new CommandOneArg('EDIT','p'));
  addCommand(new CommandPage());
  
  // two args
  addCommand(new CommandAccount('LOGIN','u','p'));
  addCommand(new CommandAccount('REGISTER','u','p'));
  addCommand(new CommandTopic());
  ///NOTE No NEWTOPIC command - there is no simple way
  // to separate title from content without keys
  
  //construct ereg to match command name
  rebuildCommandsEReg();
}

function addCommand(cmd,/*Bool*/rebuild){
  commandsMap.set(cmd.name,cmd);
  if(rebuild)
    rebuildCommandsEReg();
}

function rebuildCommandsEReg(){
  let cmdsStr = '';
  commandsMap.forEach((val,key)=>{
    cmdsStr+= (key+'|');
  });
  cmdsStr = cmdsStr.substr(0, cmdsStr.length-1); // remove last | char from string
  checkCommandEReg = new RegExp(`^\\s*(${cmdsStr})`,'i');
  log(checkCommandEReg);
}

function reinitCmd(){
  let cmd = el('#cmd');
  let newCmd = cmd.cloneNode();
  newCmd.dataset.new = 'yes';
  cmd.parentElement.appendChild(newCmd);
  $(cmd).remove();
  cmd = newCmd;
  
  $(cmd).keydown((e)=>{
    if (e.keyCode == 38) {
      if (command_number > 0) {
        if (command_number == commands.length)
          commands.push(e.currentTarget.value);
          command_number--;
          e.currentTarget.value = commands[command_number];
      }
      return false;
    }

    if (e.keyCode == 40) {
      if (command_number < commands.length - 1) {
        command_number++;
        e.currentTarget.value = commands[command_number];
      }
      return false;
    }
    
    if((e.keyCode == 13 || e.key=='Enter' || e.code=='Enter') && !e.shiftKey){
      
      let command = getCommandObj(cmd.value);
      
      logInput(cmd.value);
      sendCommand(command.processInput(cmd.value), command.processOutput.bind(command));
      return false;
    }
  });
  
  return cmd;
}

function getCommandObj(input){
  let match = checkCommandEReg.exec(input);
  if(match!==null){
    let cmd = commandsMap.get(match[1].toLowerCase());
    if(cmd) return cmd;
  }
  return new Command(input);
}

function globalClick(e){
  if(e.target.classList.contains(CLASS_BOARD_LINK)){
    simulateInput(`BOARD -n ${e.target.dataset.boardNumber}`);
  }
  else if(e.target.classList.contains(CLASS_THREAD_LINK)){
    simulateInput(`TOPIC -n ${e.target.dataset.threadNumber}`);
  }
}

function createLoginForm(){
  return createAccountForm('LOGIN');
}

function createRegForm(){
  
  let form = createAccountForm('REGISTER');
    
  form.addEventListener(EVENT_SUBMIT_ACCOUNT,(e)=>{    
    let login = id('login-form');
    let reg = e.currentTarget;
    if(login!==null){
      let lname = el('[type=text]',login);
      let lpass = el('[type=password]',login);
      let rname = el('[type=text]',reg);
      let rpass = el('[type=password]',reg);
      lname.value = rname.value;
      lname.innerText = rname.innerText;
      lpass.value = rpass.value;
      lpass.innerText = rpass.innerText;
    }
  });
  
  return form;
}

function createAccountForm(commandText){
  let form = ce('div');
  
  function getInput(type, name){
    var inp = ce('input');
    inp.setAttribute('type',type);
    inp.setAttribute('name',name);
    sanitizeInputStyle(inp);
    inp.style.color = TEXT_COLOR_HEX;
    inp.style.paddingBottom = '2px';
    inp.style.borderBottom = `2px solid ${TEXT_COLOR_HEX}`;
    inp.style.width = '10em';
    return inp;
  }
  
  let nameInput = getInput('text','name');
  let nameLabel = ce('label');
  nameLabel.appendChild(createReverse('name: '));
  nameLabel.appendChild(nameInput);
  
  let passInput = getInput('password','pass');
  let passLabel = ce('label');
  passLabel.appendChild(createReverse('password: '));
  passLabel.appendChild(passInput);
  
  let label = createReverse(`[ ${commandText.toUpperCase()} ]`);
  label.style.outline='none';
  let ok = ce('button');
  ok.appendChild(label);
  ok.style.margin = '0 auto';
  ok.style.marginTop = '15px';
  ok.style.color = TEXT_COLOR_HEX;
  ok.style.display = 'block';
  sanitizeInputStyle(ok);
  $(ok).hover((e)=>{
    e.currentTarget.querySelector('span').style.backgroundColor = '#eee';
    ok.style.cursor = 'pointer';
  }, (e)=>{
    e.currentTarget.querySelector('span').style.removeProperty('background-color');
    ok.style.removeProperty('cursor');
  });
  
  function submit(e){
    let name = el('[type=text]',form);
    let pass = el('[type=password]',form);
    simulateInput(`${commandText.toLowerCase()} -u ${name.value} -p ${pass.value}`);
    form.style.display = 'none';
    form.dispatchEvent(new Event(EVENT_SUBMIT_ACCOUNT));
  }
  
  ok.addEventListener('click',submit);
  passInput.addEventListener('keydown',(evt)=>{
    if(evt.keyCode===13)
      submit();
  });
  
  form.id = `${commandText.toLowerCase()}-form`;
  form.classList.add('acc-form');
  form.style.outline = '1px solid rgb(0,255,255)';
  form.style.padding = '15px';
  form.style.position = 'absolute';
  form.style.top = '0';
  form.style.right = '0';
  form.style.textAlign = 'right';
  form.style.backgroundColor = '#000';
  form.style.display = 'none';
  form.appendChild(nameLabel);
  form.appendChild(ce('br'));
  form.appendChild(passLabel);
  form.appendChild(ce('br'));
  form.appendChild(ok);
  
  id('board').appendChild(form);
  
  return form;
}

function sanitizeInputStyle(el){
  el.style.outline = 'none';
  el.style.border = 'none';
  el.style.background = 'transparent';
  return el;
}

function createPanelButton(text, forId){
  let ret = createReverse(text);
  $(ret).hover((e)=>{ret.style.cursor='pointer';
                    ret.style.backgroundColor='#eee';},
               (e)=>{ret.style.cursor='initial';
                    ret.style.removeProperty('background-color')});
  if(forId)
    ret.dataset.forId = forId;
  return ret;
}

function createReverse(text){
  var ret = ce('span');
  ret.classList.add('reverse');
  ret.style.padding = '2px 4px';
  ret.style.marginRight = '5px';
  ret.innerText = text;
  return ret;
}

function regEl(el){
  scriptElements.push(el);
  return el;
}

function removeRegistered(){
  scriptElements.forEach(el=>{
    $(el).remove();
  });
  scriptElements = [];
}

function simulateInput(command){
  let cmd = el('#cmd');
  cmd.value = command;
  cmd.innerText = command;
  cmd.dispatchEvent(new KeyboardEvent('keydown',{keyCode:13, shiftKey:false}));
}

function showAccountForm(e){
  let form = id(e.currentTarget.dataset.forId);
  if(form){
    if(form.parentElement===null || form.style.display === 'none'){
      let board = id('board');
      els('.acc-form',board).forEach((elt)=>elt.style.display='none');
      board.appendChild(form);
      form.style.display = 'block';
    }else{
      form.style.display = 'none';
    }
  }
}

function logInput(/*String*/command){
  commands.push(command);
  command_number = commands.length;
}

function sendCommand(/*String*/command,/*Function*/callback){
  el('#cmd').value = '';
  el('#cmd').innerText = '';
  $.ajax({
    type:'POST',
    url:'console.php',
    dataType:'json',
    data:{input: command},
    success: callback
//    success: (r)=>{callback(r);}
  });
}

function focusCmd(){
  el('#cmd').focus();
}

function removeEl(from,selector){
  var els = from.querySelectorAll(selector);
  els.forEach((v,i,l)=>{
    if(v.parentElement!==null)
      v.parentElement.removeChild(v);
  })
}

function id(id){
  return document.getElementById(id);
}

function el(/*String*/selector,/*Element*/el){
  if(el)  return el.querySelector(selector);
  else    return document.querySelector(selector);
}

function els(/*String*/selector,/*Element*/el){
  if(el)  return el.querySelectorAll(selector);
  else    return document.querySelectorAll(selector);
}

function loading(onComplete){
  str = 'Loading...';
  nextchar = str.charAt($('#loading').html().length);
  if ($('#loading').html().length < 10) {
    $('#loading').html($('#loading').html()+nextchar);
    if(onComplete)
      setTimeout(loading, 40, onComplete);
    else
      setTimeout(loading, 40);
  } else {
    $('.content').css('display', 'block');
    if(onComplete)  
      onComplete();
    else
      nav_down();
  }
}

function empty(){}

//---------------------------------------------------
// COMMANDS
//---------------------------------------------------
/*
  NOTE How commands works.
  
  There is two ways - WITH keys and WITHOUT keys.
  If input has at least one key like '-k'
  then it passes to server without any changes.
  Otherwise there is an attempt to extract values
  and rebuild input with concrete key-value data,
  then new input passed to server.
  Otherwise input passes to server without any changes.
  
*/

/** Base command */
function Command(name){
  this.name = name?name:'';
  this.name = this.name.toLowerCase();
  this.argReg = /[^\\]-(.+?)(?= -|$)/i; // is need only test, so no GLOBAL flag
}
Command.prototype.processInput = function(input){return input;};
Command.prototype.processOutput = function(response){
  if (response.edit) {
      $('#path').html(response.path+'&nbsp;>&nbsp;');
      $('#cmd').val(response.edittext);
    } else {
      if (response.clear) $('#content').html('');                                
      $('#content').append(response.message);
      if (response.path) $('#path').html(response.path+'&nbsp;>&nbsp;');
      
      $('.content').css('display', 'block');
      if (response.clear) loading();
      else nav_down();
    }
    focusCmd();
};
Command.processOutputWithContext = function(response){
  switch(currentContext){
    case CONTEXT_BOARD:
//      log('board context');
      commandsMap.get('board').processOutput(response);
      break;
      
    case CONTEXT_TOPIC:
//      log('topic context');
      commandsMap.get('topic').processOutput(response);
      break;
      
    default:
//      log('no ctx');
      Object.getPrototypeOf(Object.getPrototypeOf(this)).processOutput(response);
                       }
};
Command.getLastPage = function(pageStr){
  return lastEreg.test(pageStr)?lastPageNum:pageStr;
};

//---------------------------------------------------
// NO arg commands
//---------------------------------------------------

function CommandHelp(){
  Command.call(this, 'help');
  this.boardReg = /(BOARD +)(-n)/;
  this.topicReg = /TOPIC -n <number> [-p <page>]/;
  
  this.keysReg = /Before the parameter.+\./;
  this.newKeysInfo = 'You can write commands* with** or without** keys (keys looks like "-k").<br><br>* with the exception of <span class=reverse style="padding:0 4px">  NEWTOPIC  </span><br>** you cannot combine both ways - it is possible to use only one at a time';
}
CommandHelp.prototype = Object.create(Command.prototype);
CommandHelp.prototype.constructor = CommandHelp;
CommandHelp.prototype.processInput = function(input){return input;};
CommandHelp.prototype.processOutput = function(response){
  
  if(response.clear) $('#content').html('');
  let msg = response.message.replace(this.keysReg, this.newKeysInfo);
  
  $('#content').append(msg);
  if (response.path) $('#path').html(response.path+'&nbsp;>&nbsp;');
  if (response.clear) loading();
  else                nav_down();
};

function CommandBoards(){
  Command.call(this,'boards');
}
CommandBoards.prototype = Object.create(Command.prototype);
CommandBoards.prototype.constructor = CommandBoards;
CommandBoards.prototype.processOutput = function(response){
  
  if (response.clear) $('#content').html('');
  let els = $.parseHTML(response.message);
  els.forEach((el)=>{
    
    let nodes = Array.prototype.slice.call(el.childNodes);
    nodes = nodes.map((n)=>{
      if(n.nodeType!==3)
        return n;
      else{
        let matches = boardEreg.exec(n.textContent);
        if(matches!==null){
          let num = matches[1];
          let name = matches[2];
          let b = ce('span');
          b.classList.add(CLASS_BOARD_LINK);
          b.innerText = `[${num}] ${name} `;
          b.dataset.boardNumber = num;
          $(b).hover(underliner,unUnderliner);
          $(b).hover(pointer,unPointer);
          $(b).hover(textHighlight,unTextHighlight);
          return b;
        }
        else  return n;
      }
    });
    
    while(el.firstChild!==null)
      el.removeChild(el.firstChild);
    nodes.forEach(n=>el.appendChild(n));
  });
  
  els.forEach((el)=>$('#content').append(el));
  
  if (response.path) $('#path').html(response.path+'&nbsp;>&nbsp;');
  if (response.clear) loading();
  else                nav_down();
  focusCmd();
  currentContext = CONTEXT_BOARDS;
};

function CommandNav(name){
  Command.call(this, name);
}
CommandNav.prototype = Object.create(Command.prototype);
CommandNav.prototype.constructor = CommandNav;
CommandNav.prototype.processOutput = function(response){
  Command.processOutputWithContext.call(this,response);
};

//---------------------------------------------------
// ONE args commands
//---------------------------------------------------

function CommandOneArg(name,arg){
  Command.call(this, name);
  this.arg = arg;
  this.ereg = new RegExp(`${this.name} +(.+)`,'i');
}
CommandOneArg.prototype = Object.create(Command.prototype);
CommandOneArg.prototype.constructor = CommandOneArg;
CommandOneArg.prototype.processInput = function(input){
  let match = this.argReg.exec(input);
  if(match){
    return input;
  }
  
  match = this.ereg.exec(input);
  if(match){
    return `${this.name} -${this.arg} ${match[1]}`;
  }
  
  return input;
};

function CommandTimezone(){
  CommandOneArg.call(this, 'timezone', 'u');
}
CommandTimezone.prototype = Object.create(CommandOneArg.prototype);
CommandTimezone.prototype.constructor = CommandTimezone;

function CommandBoard(){
  CommandOneArg.call(this,'board', 'n');
}
CommandBoard.prototype = Object.create(CommandOneArg.prototype);
CommandBoard.prototype.constructor = CommandBoard;
CommandBoard.prototype.processOutput = function(response){
  if (response.clear) $('#content').html('');
  
  let wrap = ce('div');
  let els = $.parseHTML(response.message);
  els.forEach((elt)=>wrap.appendChild(elt));
  
  let numSelector = 'tr > td.postsnumber';
  let nameSelector = 'td > span.reverse';
  let nums = wrap.querySelectorAll(numSelector);
  let names = wrap.querySelectorAll(nameSelector);
  nums.forEach((elt,i)=>{
    
    let matches = bracketsEreg.exec(elt.innerText);
    let threadNumber = matches[1];
    let span = ce('span');
    span.classList.add(CLASS_THREAD_LINK);
    span.innerText = threadNumber;
    span.dataset.threadNumber = threadNumber;
    $(span).hover(underliner, unUnderliner);
    $(span).hover(pointer, unPointer);
    $(span).hover(textHighlight, unTextHighlight);
    
    elt.innerText = '';
    elt.appendChild(cn('['));
    elt.appendChild(span);
    elt.appendChild(cn(']'));
    
    let nameElt = names[i];
    nameElt.classList.add(CLASS_THREAD_LINK);
    nameElt.dataset.threadNumber = threadNumber;
    $(nameElt).hover(pointer, unPointer);
    $(nameElt).hover((e)=>e.currentTarget.style.backgroundColor='#eee',
                     (e)=>e.currentTarget.style.removeProperty('background-color'));
    
  });
  
  els.forEach((elt)=>el('#content').appendChild(elt));
  
  if (response.path) $('#path').html(response.path+'&nbsp;>&nbsp;');
  if (response.clear) loading(empty);
  
  focusCmd();
  currentContext = CONTEXT_BOARD;
};

function CommandRvt(){
  CommandOneArg.call(this,'rvt','p');
  this.ereg = new RegExp(`${this.name}( +(\\w+))?`,'i');
}
CommandRvt.prototype = Object.create(CommandOneArg.prototype);
CommandRvt.prototype.constructor = CommandRvt;
CommandRvt.prototype.processInput = function(input){
  let match = this.argReg.exec(input);
  if(match)
    return input;
  
  match = this.ereg.exec(input);
  if(match){
    let page = match[1];
    let ret;
    if(page){
      page = Command.getLastPage(match[2]);
      ret = `rvt -p ${page}`;
    }else      
      ret = `rvt`;
    
    return ret;
  }
  
  return ret;
};
CommandRvt.prototype.processOutput = CommandBoard.prototype.processOutput;

function CommandReply(){
  CommandOneArg.call(this,'reply','m');
  this.argReg = /[^\\]-(\w)(?= |$)/i;
}
CommandReply.prototype = Object.create(CommandOneArg.prototype);
CommandReply.prototype.constructor = CommandReply;

function CommandPage(){
  CommandOneArg.call(this,'page','p');
}
CommandPage.prototype = Object.create(CommandOneArg.prototype);
CommandPage.prototype.constructor = CommandPage;
CommandPage.prototype.processOutput = function(r){
  Command.processOutputWithContext.call(this, r);
};

//---------------------------------------------------
// TWO args commands
//---------------------------------------------------

function CommandTwoArgs(name,arg1,arg2){
  CommandOneArg.call(this,name,arg1);
  this.arg2 = arg2;
  this.ereg = new RegExp(`${this.name} +(\\w+) +(.+)`,'i');
}
CommandTwoArgs.prototype = Object.create(CommandOneArg.prototype);
CommandTwoArgs.prototype.constructor = CommandTwoArgs;
CommandTwoArgs.prototype.processInput = function(input){
  // check if input has key-value like '-u username'
  // if so do nothing and return input as is
  // otherwise check if input have no keys like 'login username password'
  // if so - build command with appropriate keys and values
  // else return input as is
  let match = this.argReg.exec(input);
  if(match){
    // it is a key-value variant
    return input;
  }
  
  match = this.ereg.exec(input);
  if(match){
    // no keys variant
    return `${this.name} -${this.arg} ${match[1]} -${this.arg2} ${match[2]}`;
  }
  
  return input;
};

function CommandAccount(name, arg1, arg2){
  CommandTwoArgs.call(this,name,arg1,arg2);
}
CommandAccount.prototype = Object.create(CommandTwoArgs.prototype);
CommandAccount.prototype.constructor = CommandAccount;

function CommandTopic(){
  CommandTwoArgs.call(this,'topic','n','p');
  this.ereg = new RegExp(`${this.name} +(\\w+)( +(\\w+))?`,'i');
}
CommandTopic.prototype = Object.create(CommandTwoArgs.prototype);
CommandTopic.prototype.constructor = CommandTopic;
CommandTopic.prototype.processInput = function(input){
  let match = this.argReg.exec(input);
  if(match)
    return input;
  
  match = this.ereg.exec(input);
  if(match){
    let num = match[1];
    let page = match[2];
    let ret;
    if(page){
      page = Command.getLastPage(match[3]);
      ret = `${this.name} -n ${num} -p ${page}`;
    }else{
      ret = `${this.name} -n ${num}`;
    }
    return ret;
  }
  
  return input;
};
CommandTopic.prototype.processOutput = function(response){
  Object.getPrototypeOf(CommandTopic.prototype).processOutput.call(this, response);
  currentContext = CONTEXT_TOPIC;
};




















