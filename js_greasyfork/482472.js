// ==UserScript==
// @name         AtCoder Ranking of Fav Users
// @namespace    https://github.com/Wiiiiam104/
// @version      0.0.3
// @description  AtCoderのランキングページにお気に入りのみ表示ボタンを追加します
// @author       Wiiiiam104
// @match        https://atcoder.jp/ranking*
// @downloadURL https://update.greasyfork.org/scripts/482472/AtCoder%20Ranking%20of%20Fav%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/482472/AtCoder%20Ranking%20of%20Fav%20Users.meta.js
// ==/UserScript==

(async ()=>{

  let a=document.createElement("a");
  let fav=document.location.href.includes("fav=1")
  a.href=`https://atcoder.jp/ranking?fav=${!fav-0}`
  a.innerHTML=`お気に入りのみ表示`
  document.querySelector(".panel-heading").appendChild(a);
  if(!fav) return;


  function init_ranking_table(){
    document.querySelector(".table > tbody").innerHTML="";
  }

  function add_ranking_data(user_data, standing_in_fav){
    let country_code =user_data.country_code;
    let crown        =user_data.crown       ;
    let user_name    =user_data.user_name   ;
    let affiliation  =user_data.affiliation ;
    let rank         =user_data.rank        ;
    let birth        =user_data.birth       ;
    let rating       =user_data.rating      ;
    let highest      =user_data.highest     ;
    let matches      =user_data.matches     ;
    let wins         =user_data.wins        ;

    let tr=document.createElement("tr");
    tr.innerHTML=`
      <td class="no-break"><span class="small gray">(${standing_in_fav})</span> ${rank}</td>
      <td><a href="/ranking?contestType=algo&amp;f.Country=${country_code}"><img src="//img.atcoder.jp/assets/flag/${country_code}.png"></a> ${crown} ${user_name}
        <a href="/ranking?contestType=algo&amp;f.Affiliation=Preferred+Networks%2C+Inc."><span class="ranking-affiliation break-all">${affiliation}</span></a></td>
      <td>${birth}</td>
      <td><b>${rating}</b></td>
      <td><b>${highest}</b></td>
      <td>${matches}</td>
      <td>${wins}</td>
    `;
    document.querySelector(".table > tbody").appendChild(tr);
  }


  async function get_user_data(user_id){
    let url=`https://atcoder.jp/users/${user_id}?lang=en`;
    let str=await fetch(url).then(res => res.text());
    let tmp_user_data={};

    let html=document.createElement("span");
    html.innerHTML=str;

    html.querySelectorAll(".dl-table").forEach(table=>{
      table.querySelectorAll("tr").forEach(tr=>{
        let th=tr.querySelector("th").innerHTML.split(" <")[0].split("<")[0];
        let td=tr.querySelector("td");
        tmp_user_data[th]=td;
      })
    });
    tmp_user_data.user_name=html.querySelector(".col-md-3 > h3");


        user_id      =user_id;
    let country_code =tmp_user_data.user_name.querySelectorAll("img")[0].outerHTML.split("/").slice(-1)[0].split(".")[0]??"";
    let crown        =tmp_user_data.user_name.querySelectorAll("img")[1].outerHTML??"";
    if(crown.includes("fav")) crown="";
    let user_name    =tmp_user_data.user_name.querySelector(".username").outerHTML??"";
    let affiliation  =(tmp_user_data["Affiliation"]===undefined?"":tmp_user_data["Affiliation"].innerHTML)
    let rank         =tmp_user_data["Rank"].innerHTML.slice(0,-2)??"";
    let birth        =(tmp_user_data["Birth Year"]===undefined?"":tmp_user_data["Birth Year"].innerHTML);
    let rating       =tmp_user_data["Rating"].querySelector("span").innerHTML-0??0;
    let highest      =tmp_user_data["Highest Rating"].querySelector("span").innerHTML??"";
    let matches      =tmp_user_data["Rated Matches"].innerHTML??"";
    let wins         ="未対応"??"";

    let user_data={user_id,country_code,crown,user_name,affiliation,rank,birth,rating,highest,matches,wins};
    return user_data;
  }

  async function init_with_scraping_user_pages(user_ids){
    let ranking_data=[];
    for(let user_id of user_ids){
      await new Promise(resolve => setTimeout(resolve, 1000));
      await get_user_data(user_id).then(user_data=>{
        ranking_data.push(user_data);
      });
    };
    let last_update=Math.floor((new Date()).getTime()/1000);
    localStorage.tmXRNR17Aj=JSON.stringify({last_update,ranking_data});
  }


  async function update_ranking_data(contest_id){
    let fav_users=JSON.parse(localStorage.fav);
    let ranking_data=JSON.parse(localStorage.tmXRNR17Aj).ranking_data;

    await new Promise(resolve => setTimeout(resolve, 1000));
    let url=`https://atcoder.jp/contests/${contest_id}/standings/json`;
    let standings_data=await fetch(url).then(res => res.json()).then(res=>res.StandingsData);

    for(let standings_data_element of standings_data){
      if(fav_users.includes(standings_data_element.UserName)){
        let user_data_in_local_storage={};
        for(let data of ranking_data){
          if(data.user_id==standings_data_element.UserName) user_data_in_local_storage=data;
        }
        if(user_data_in_local_storage=={}){
          user_data_in_local_storage=await get_user_data(standings_data_element.UserName);
        }

        user_data_in_local_storage.rating=standings_data_element.Rating-0;
        if(user_data_in_local_storage.highest<standings_data_element.Rating-0)
        user_data_in_local_storage.highest=standings_data_element.Rating-0;
      }
    }

    let last_update=JSON.parse(localStorage.tmXRNR17Aj).last_update;
    localStorage.tmXRNR17Aj=JSON.stringify({last_update,ranking_data});
  }

  async function update_ranking_data_with_contest_pages(from_when){
    let url="https://kenkoooo.com/atcoder/resources/contests.json";
    let contest_data=await fetch(url).then(res => res.json());

    let necessary_contest_data=[];
    for(let data of contest_data){
      if(data.start_epoch_second >= from_when) necessary_contest_data.push(data);
    }
    
    let compare=(a,b)=>a.start_epoch_second<b.start_epoch_second?-1:1;
    necessary_contest_data.sort(compare);

    for(let data of necessary_contest_data){
      await update_ranking_data(data.id);
    }
  }


  async function update_local_storage(){
    let fav_users=JSON.parse(localStorage.fav);
    let ranking_data=JSON.parse(localStorage.tmXRNR17Aj??{}).ranking_data;
    let now_unix_time=Math.floor((new Date()).getTime()/1000);
    let last_update=JSON.parse(localStorage.tmXRNR17Aj??{}).last_update;

    if(ranking_data===undefined || last_update===undefined || now_unix_time-last_update>365*24*60*60){
      await init_with_scraping_user_pages(fav_users);
    }else{
      await update_ranking_data_with_contest_pages(last_update);
      last_update=Math.floor((new Date()).getTime()/1000);
      let ranking_data=JSON.parse(localStorage.tmXRNR17Aj).ranking_data;
      localStorage.tmXRNR17Aj=JSON.stringify({last_update,ranking_data});
    }
  }


  async function main(){
    init_ranking_table();
    await update_local_storage();

    let ranking_data=JSON.parse(localStorage.tmXRNR17Aj).ranking_data;

    let compare=(a,b)=>a.rating<b.rating?1:-1;
    ranking_data.sort(compare);

    for(let i=0;i<ranking_data.length;i++)
      add_ranking_data(ranking_data[i],i+1);
  }

  main();

})();