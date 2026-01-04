// ==UserScript==
// @name         AtCoder Problems Team Standings (beta ver.)
// @namespace    AtCoder Problems
// @version      0.3
// @description  Problemsのバーチャルコンテストで(身内用)チーム順位表を作成します。
// @author       harurun
// @match        https://kenkoooo.com/atcoder/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/425668/AtCoder%20Problems%20Team%20Standings%20%28beta%20ver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/425668/AtCoder%20Problems%20Team%20Standings%20%28beta%20ver%29.meta.js
// ==/UserScript==

/*グローバル変数*/
//ユーザ名とチーム名の対応連想配列
var user_team={};
//上記の逆の連想配列
var user_to_team={};
//コンテスト名
var contest="";
//各問題の点数
var problem=[];
//チームスコア
var team_sc_data={};
//チームの集合
var teams=new Set();
//settingユーザ集合
var users=new Set();
//ペナタイム
var penalty_time=300;
//各問題を管理
var problem_name={};
//開始時間
var start_time=0;
//終了時間
var end_time=0;
//standingを変数に格納
var standing;
//team_standing 変数
var team_standing;
//debug cnt
var debug_cnt=0;
//tr_elements
var tr_elements;


/*コンテスト名を返す*/
function get_contest(){
  contest=document.getElementsByTagName("h1")[0].textContent;
  penalty_time=parseInt(document.getElementsByTagName("th")[1].nextElementSibling.textContent.split(" ")[0]);
  return;
}

/*チームスコアの初期化関数*/
function set_team(cnt/*問題数*/){
  var team_list=[...teams];
  for(var i in team_list){
    team_sc_data[team_list[i]]=[];
    for(var j=0;j<cnt;j++){
      team_sc_data[team_list[i]].push([-1,0]);
    }
  }
  return;
}

/*各チームの点数を数える*/
function get_users(i,tr_elements,cnt){
  //console.log(`cnt:${cnt}`)
  for(;i<tr_elements.length;i++){
    var u=tr_elements[i].children
    //console.log(u);
    var user_name=u[1].children[0].textContent.replace(/\s+/g, "");//名前
    //console.log(`user_name:${user_name}`,"users.has:",users.has(user_name));
    if(!users.has(user_name))continue;
    var team=user_team[user_name];
    for(var j=3;j<cnt+3;j++){
      //console.log(u[j]);
      //if(u[j]==undefined)break;
      if(u[j].textContent==="-")continue;//未提出
      var t=u[j].children[0].children;//スコアとペナ//
      //console.log(`t_length:${t.length}`);
      if(t.length===0)continue;
      var sc=t[0].textContent;//点数//部分点はそもそもProblemsにないので使わない
      var pnl_int=0;
      if(t.length==2){//0ペナでも必ず2つあるらしい
        var pnl_str=t[1].textContent;//ペナ数
        if(!(pnl_str==="")){
          pnl_int=pnl_str.substr(1,pnl_str.length-2);//ペナ数の()を外す
        }
      }
      //ペナを足す
      team_sc_data[team][j-3][1]+=parseInt(pnl_int);
      //console.log(`sc:${sc}`);
      if(sc==="0")continue;//WA
      var spend_time=u[j].children[1].textContent.split(":");//時間
      //素の時間で比較する。ペナは足すだけ
      if(parseInt(team_sc_data[team][j-3][0])===-1){
        team_sc_data[team][j-3][0]=parseInt(spend_time[0]*3600)+parseInt(spend_time[1])*60+parseInt(spend_time[2]);
      }else if(parseInt(spend_time[0]*3600)+parseInt(spend_time[1])*60+parseInt(spend_time[2])<parseInt(team_sc_data[team][j-3][0])){
        team_sc_data[team][j-3][0]=parseInt(spend_time[0]*3600)+parseInt(spend_time[1])*60+parseInt(spend_time[2]);
      }
      //console.log(team_sc_data);
    }/*各ユーザの点数for*/
  }/*各ユーザ*/
  return;
}

//問題の点数を数える関数
function get_score(){
  var start_flag=false;
  //var tr_elements=document.getElementsByTagName("tr");
  //console.log(document.getElementsByTagName("tr"));
  for(var i=0;i<tr_elements.length;i++){
    var f=tr_elements[i].children;
    //console.log(f);
    //終了
    if(f[0].textContent==="#"){
    //各ユーザの時間を取得
      set_team(problem.length);
      get_users(i+1,tr_elements,problem.length);
      break;
    }
    //開始
    if(f[f.length-1].textContent==="Score"){
      start_flag=true;
      continue;
    }
    //カウント
    if(start_flag){
      var ret=f[f.length-1].textContent;
      if(ret===""){
        ret=1;
      }
      problem.push(parseInt(ret));
      var prob_url_txt=String(f[1].children[0].href).split("/");
      problem_name[parseInt(f[0].textContent)-1]=prob_url_txt[prob_url_txt.length-1];
    }
  }
  //console.log(team_sc_data);
  display_score();
  return;
}

/*チームスコアを表示する*/
function display_score(){
  //console.log(`start display_score:${debug_cnt}回目`);
  //console.log(team_sc_data);
  debug_cnt++;
  //それぞれのチームの得点を計算してソートする。
  var scores=[];//[合計,ペナ入り時間,チーム名]
  for(var key in team_sc_data){
    var team_sc=team_sc_data[key];
    var point=0;
    var time_sec=0;
    var cnt_pnl=0;
    var pure_time=0;
    for(var i=0;i<team_sc.length;i++){
      if(team_sc[i][0]===-1)continue;
      if(team_sc[i][0]!==-1){
        point+=problem[i];
      }
      if(team_sc[i][1]!==-1){
        time_sec=Math.max(time_sec,team_sc[i][0]+team_sc[i][1]*penalty_time);
        pure_time=Math.max(pure_time,team_sc[i][0]);
        cnt_pnl+=team_sc[i][1];
      }
    }
    scores.push([point,time_sec,key,pure_time,cnt_pnl]);
  }
  scores.sort(function(a,b){
    if(a[0]===b[0]){
      if(a[1]===b[1]){
        return a[4]-b[4];//ペナが少ない方
      }
      return a[1]-b[1];//スコアが同じ時はペナ入りの時間で
    }else{
      return b[0]-a[0];
    }
  })

  var div_my2=document.createElement("div");
  div_my2.id="standing-frame";
  team_standing=div_my2;
  var div_title=document.createElement("div");

  var title_h4=document.createElement("h4");
  var h4_text=document.createTextNode("Team-Standings")
  title_h4.appendChild(h4_text);
  div_title.appendChild(title_h4);

  div_my2.appendChild(div_title);

  //div1,div2->
  var div1 = document.createElement("div");
  div1.classList.add("row");

  var div2=document.createElement("div");
  div2.classList.add("col-sm-12");

  //table->
  var main_table = document.createElement("table");

  //thead->
  var main_thead = document.createElement("thead");
  var head_tr=document.createElement("tr");
  head_tr.classList.add("text-center");

  var sharp_th=document.createElement("th");
  var sharp_text=document.createTextNode("##");
  sharp_th.appendChild(sharp_text);
  head_tr.appendChild(sharp_th);

  var te_th=document.createElement("th");
  var te_text=document.createTextNode("Team");
  te_th.appendChild(te_text);
  head_tr.appendChild(te_th);

  var sc_th=document.createElement("th");
  var sc_text=document.createTextNode("Score");
  sc_th.appendChild(sc_text);
  head_tr.appendChild(sc_th);

  for(var i=0;i<problem.length;i++){
    var num_th=document.createElement("th");
    var num_text=document.createTextNode(String(i+1));
    num_th.appendChild(num_text);
    head_tr.appendChild(num_th);
  }

  main_table.appendChild(head_tr);
  //<-thead

  //tbody->
  var team_list=[...teams];
  var main_tbody=document.createElement("tbody");
  for(var i=0;i<team_list.length;i++){
    var now_team=scores[i];
    var create_tr=document.createElement("tr");
    //thを追加していく
    //id を付ける

    //順位
    var create_rank=document.createElement("th");
    var rank_text=document.createTextNode(String(i+1));
    create_rank.appendChild(rank_text);
    create_tr.appendChild(create_rank);

    //チーム名
    var team_th=document.createElement("th");
    var display_name=String(now_team[2])+"(";
    for(var l=0;l<user_to_team[now_team[2]].length;l++){
      display_name+=user_to_team[now_team[2]][l];
      display_name+=","
    }
    display_name=display_name.slice(0,-1)+")";
    var team_text=document.createTextNode(display_name);
    team_th.appendChild(team_text);
    create_tr.appendChild(team_th);

    //スコア合計
    var sum_td=document.createElement("td");

    var score_p1=document.createElement("p");
    score_p1.style="text-align: center; margin: 0px;";

    var score_span1=document.createElement("span");
    score_span1.style="color: limegreen; font-weight: bold;";
    var span1_text=document.createTextNode(String(now_team[0]));
    score_span1.appendChild(span1_text);
    score_p1.appendChild(score_span1);

    var score_span2=document.createElement("span");
    score_span2.style="color: red;";
    if(now_team[4]!==0){
      var span2_text=document.createTextNode(" ("+String(now_team[4])+")");
      score_span2.appendChild(span2_text);
    }
    score_p1.appendChild(score_span2);

    sum_td.appendChild(score_p1);

    if(now_team[1]!==0){

    var score_p2=document.createElement("p");
    score_p2.style="text-align: center; margin: 0px;";

    var score_span3=document.createElement("span");
    score_span3.style="color: gray;";
    var time_hour=now_team[1]/3600|0;
    var time_min=(now_team[1]-time_hour*3600)/60|0;
    var time_s=now_team[1]-time_hour*3600-time_min*60;
    var span3_text=document.createTextNode(String(time_hour)+":"+(("00"+String(time_min)).slice(-2))+":"+(("00"+String(time_s)).slice(-2)));//合計はペナ入り時間
    score_span3.appendChild(span3_text);
    score_p2.appendChild(score_span3);

    sum_td.appendChild(score_p2);
    }else{
      var score_p2=document.createElement("p");
      score_p2.style="text-align: center; margin: 0px;";
      var score_span3=document.createElement("span");
      score_span3.style="color: gray;";
      var span3_text=document.createTextNode("-");
      score_span3.appendChild(span3_text);
      score_p2.appendChild(score_span3);

      sum_td.appendChild(score_p2);
    }
    create_tr.appendChild(sum_td);
    //<-スコア

    //各問題の点数
    var now_team_sc=team_sc_data[now_team[2]];
    for(var j=0;j<problem.length;j++){
      var num_td=document.createElement("td");

      var score_p1=document.createElement("p");
      score_p1.style="text-align: center; margin: 0px;";

      var sp_time=now_team_sc[j][0];
      var pn_cnt=now_team_sc[j][1];

      if(sp_time!==-1){
        var score_span1=document.createElement("span");
        score_span1.style="color: limegreen; font-weight: bold;";
        var span1_text=document.createTextNode(String(problem[j]));
        score_span1.appendChild(span1_text);
        score_p1.appendChild(score_span1);

        var score_span2=document.createElement("span");
        score_span2.style="color: red;";
        if(pn_cnt!==0){
          var span2_text=document.createTextNode(" ("+String(pn_cnt)+")");
          score_span2.appendChild(span2_text);
        }
        score_p1.appendChild(score_span2);

        num_td.appendChild(score_p1);

        var score_p2=document.createElement("p");
        score_p2.style="text-align: center; margin: 0px;"

        var score_span3=document.createElement("span");
        score_span3.style="color: gray;";
        var time_hour=sp_time/3600|0;
        var time_min=(sp_time-time_hour*3600)/60|0;
        var time_s=sp_time-time_hour*3600-time_min*60;
        var span3_text=document.createTextNode(String(time_hour)+":"+(("00"+String(time_min)).slice(-2))+":"+(("00"+String(time_s)).slice(-2)));
        score_span3.appendChild(span3_text);
        score_p2.appendChild(score_span3);

        num_td.appendChild(score_p2);
        create_tr.appendChild(num_td);
      }else{//未提出
        num_td.classList.add("text-center");
        var non_text=document.createTextNode("-");
        num_td.appendChild(non_text);
        create_tr.appendChild(num_td);
      }
    }
    main_tbody.appendChild(create_tr);
  }
  main_table.appendChild(main_tbody);
  div2.appendChild(main_table);
  div1.appendChild(div2);
  div_my2.appendChild(div1);

  var before_node=document.getElementsByClassName("my-2");
  before_node[2].parentNode.insertBefore(div_my2,before_node[2].nextElementSibling);
  return;
}

/*GMから設定を読み込む*/
function get_settings() {
  var settings=GM_getValue(contest)
  if(settings===undefined){
    return false;
  }
  var config=settings.split(",");
  for(var i=0;i<config.length;i++){
    var user=config[i].split(":")[0];
    var team=config[i].split(":")[1];
    user_team[user]=team;
    if(user_to_team[team]===undefined){
      user_to_team[team]=[user];
    }else{
      user_to_team[team].push(user);
    }
    teams.add(team);
    users.add(user);
  }
  return true;
}

/*GMに設定を保存する*/
function save_settings() {
  var settings="";
  for(var key in user_team){
    var ret=key+":"+user_team[key]+",";
    settings+=ret;
  }
  settings=settings.slice(0,-1);
  GM_setValue(contest,settings);
  location.reload();//saveしたあとはリロード
  return;
}

/*ファイルを開いて内容をGMに保存する*/
function open_file(evt){
  var reader=new FileReader();
  reader.readAsText(evt.target.files[0]);
  reader.addEventListener("load",()=>{
    var ts=reader.result.replace(/\r?\n/g,"").replace("{","").replace("}","").replace(/\s+/g, "");
    var tx=ts.split(",");
    user_team={};//初期化
    user_to_team={};//初期化
    teams.clear();//初期化
    users.clear();//初期化
    for(var i=0;i<tx.length;i++){
      var te=tx[i].split(":");
      user_team[te[0]]=te[1];
      if(user_to_team[te[1]]===undefined){
        user_to_team[te[1]]=[te[0]];
      }else{
        user_to_team[te[1]].push(te[0]);
      }
      teams.add(te[1]);
      users.add(te[0]);
    }
    save_settings();
    get_score();
    display_score();
  })
  setting_flag=true;
  console.log("setting is saved");
  return;
}

/*ファイルを開くボタンを追加する*/
function add_file_button() {
  var button=document.createElement("input");
  button.id="add_file";
  button.type="file";
  var ref=document.getElementsByTagName("h4")[0];
  var my_parent=ref.parentNode;
  my_parent.appendChild(button);
  button.addEventListener('change',open_file,false);
  console.log("file button added")
  return;
}

/*auto_refreshを削除*/
function remove_auto(){
  var auto_button=document.getElementById("autoRefresh");
  //auto_button.checked=true;
  var auto_label=auto_button.nextElementSibling;
  //auto_label.remove();
  //auto_button.remove();removeすると更新されない
  return;
}

/*pin meを削除*/
function remove_pin(){
  try{
    var pin_me=document.getElementById("pinMe");
    pin_me.checked=false;
    var pin_label=pin_me.nextElementSibling;
    pin_label.remove();
    pin_me.remove();
  }catch(e){
    return;
  }
}

function get_contest_time(){
  var elements_tbody=document.getElementsByTagName("tbody");
  var time_list=elements_tbody[0].children[0].children[1].textContent.split(" ");
  start_time_str=time_list[0]+" "+time_list[1];
  end_time_str=time_list[4]+" "+time_list[5];
  start_time=Date.parse(start_time_str);
  end_time=Date.parse(end_time_str);
  return;
}

function out_file(){
  var file_text=`{"contest":"${contest}","start_time":${start_time},"end_time":${end_time},"penalty_time":${penalty_time},`;
  var problems_text="\"problems\":{";
  for(var i=0; i<problem.length;i++){
    problems_text+=`${i+1}:{"problem_id":"${problem_name[i]}","score":${problem[i]}},`;
  }
  problems_text=problems_text.slice(0,-1)+"}";
  file_text+=problems_text+",";
  var team_text="\"teams\":{";
  for(var key in user_to_team){
    var ret=`"${key}":[`;
    var local_users=user_to_team[key];
    for(var i=0; i<local_users.length;i++){
      ret+=`"${local_users[i]}",`;
    }
    team_text+=ret.slice(0,-1)+"],";
  }
  file_text+=team_text.slice(0,-1)+"}}";
  return file_text;
}

function add_download_button(){
  if(new Date(end_time)-new Date()>0)return;
  var file_text=out_file();
  var file_name=`${contest}_result.json`;
  var download_link=document.createElement("a");
  download_link.href="data:text/plain,"+encodeURIComponent(file_text);
  download_link.download=file_name;
  download_link.textContent="result";
  var ref=document.getElementById("add_file");
  var my_parent=ref.parentNode;
  my_parent.appendChild(download_link);
  console.log("download link is added");
  return;
}

function set_standing_id(){
  standing=document.getElementsByTagName("h3")[1].parentNode.parentNode.parentNode.parentNode.childNodes[1];
  standing.id="personal-standing";
  //console.log(document.getElementsByTagName("h3")[1].parentNode.parentNode.parentNode.parentNode.childNodes[1]);
  return;
}

function get_tr(){
  tr_elements=document.getElementsByTagName("tr");
  return;
}



function main(){
  //コンテスト以外のページの場合は即return
  if(!location.href.match("https://kenkoooo.com/atcoder/#/contest/show/.*")){
    return;
  }
  get_tr();
  set_standing_id();//idを追加
  get_contest();//コンテスト名を取得
  add_file_button();//ファイルを開くボタンを追加
  //remove_auto();//auto_refreshを削除する(確実にバグるので)=>beta版では実装する予定
  remove_pin();//pin_meを削除=>背景色を付ける予定(未定)
  get_contest_time();
  var flags=get_settings();//GM_getValueする
  if(flags){
    get_score();//スコアを取得する
    //display_score();//チームスコアを表示
    add_download_button();
    /*変更感知*/
    var observer=new MutationObserver(()=>{
      //console.log("変更を感知しました!");
      team_standing.parentNode.removeChild(team_standing);
      if(!location.href.match("https://kenkoooo.com/atcoder/#/contest/show/.*")){
        return;
      }
      //setTimeout(()=>{
        problem=[];
        get_score();
        //console.log(user_team,user_to_team,team_sc_data,problem_name);
        //display_score();
      //},5000);
    });
    const config={
      attributes:true,
      childList:true,
      characterData:true,
      subtree:true
    };
    observer.observe(standing,config);
    var page=document.getElementById("root").childNodes[0].childNodes[0];
    //console.log(page);
    var page_observer=new MutationObserver(()=>{
      //console.log("ページ全体の更新");
      //ページ上部の更新を見る(全体だと時間を含むので毎秒確認することになってしまう)
      if(!location.href.match("https://kenkoooo.com/atcoder/#/contest/show/.*")){
        team_standing.parentNode.removeChild(team_standing);
        location.reload();
        return;
      }
    });
    page_observer.observe(page,config);
  }
  return;
}

setTimeout(()=>{
  main();
},5000)
