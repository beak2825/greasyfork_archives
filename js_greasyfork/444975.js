// ==UserScript==
// @name        辽宁干部在线专业技术区学习2024
// @namespace   Violentmonkey Scripts
// @match       https://zyjstest.lngbzx.gov.cn/pc/*/video_detail?*
// @grant       none
// @version     3.0
// @author      vlararara
// @description 针对2024年辽宁干部在线专业技术区学习使用
// @run-at      document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/444975/%E8%BE%BD%E5%AE%81%E5%B9%B2%E9%83%A8%E5%9C%A8%E7%BA%BF%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%8C%BA%E5%AD%A6%E4%B9%A02024.user.js
// @updateURL https://update.greasyfork.org/scripts/444975/%E8%BE%BD%E5%AE%81%E5%B9%B2%E9%83%A8%E5%9C%A8%E7%BA%BF%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%8C%BA%E5%AD%A6%E4%B9%A02024.meta.js
// ==/UserScript==

(function(){
function Learn(){
  //alert("开始学习");
  var id=document.URL.split('&id=')[1].split('&')[0];
  var url="https://zyjstest.lngbzx.gov.cn/trainee/api/course/detail/"+id;
  console.log("id:"+id+",url:"+url);
  async function fetchdata(){
    var rdata = await fetch(url, {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh,zh-CN;q=0.9,zh-HK;q=0.7,zh-TW;q=0.6,zh-SG;q=0.4,en-US;q=0.3,en;q=0.1",
        "Cache-Control": "no-cache",
        "signature": "adfasfsdaffsdafsdafaj",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Pragma": "no-cache"
    },
    "referrer": "https://zyjstest.lngbzx.gov.cn/",
    "method": "GET",
    "mode": "cors"
  });
	var jsonResponse = await rdata.json();
	return jsonResponse;
  }
  fetchdata().then((jsonResponse)=>{
	//从第一次get请求返回的响应中提取四个变量
	//sco是空的，取不到
    var playcourse=document.URL.split('playCourse=')[1].split('&id')[0]; //从页面地址里拿
    var user_course_id=jsonResponse.data.course.user_course_id; //从data.course.user_course_id拿
    var sco_id=JSON.parse(jsonResponse.data.course.manifest)[0].identifierref; //在manifest的identifierref
    var lesson_location=30; //指定一个时间行不行？


    var s=document.querySelectorAll('[class^="timetext"]')[0].innerText.split('/ ')[1].split(':');
    var length=parseInt(s[0])*60+parseInt(s[1]); //得到视频总长度
    var session_time=length-lesson_location;

    console.log(playcourse,user_course_id,sco_id,lesson_location,length,session_time);
    data={"playCourse":playcourse,"user_course_id":user_course_id,"scormData":[{"sco_id":sco_id,"lesson_location":lesson_location,"session_time":session_time}]};
    fetch("https://zyjstest.lngbzx.gov.cn/trainee/index/user_course", {
      "credentials": "include",
      "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh,zh-CN;q=0.9,zh-HK;q=0.7,zh-TW;q=0.6,zh-SG;q=0.4,en-US;q=0.3,en;q=0.1",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "signature": "adfasfsdaffsdafsdafaj",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
      },
      "referrer": "https://zyjstest.lngbzx.gov.cn/",
      "body": JSON.stringify(data),
      "method": "POST",
      "mode": "cors"
    });
    alert("完毕");
  });
  }


  const interval = setInterval(() => {
    const titleElement = document.getElementsByClassName('title')[0];
    if (titleElement) {
      const btn = document.createElement("button");
      btn.textContent = "一键学习";
      btn.onclick=function(){Learn()};
      titleElement.appendChild(btn);
      clearInterval(interval); // 停止检测
    }
  }, 500); // 每 500 毫秒检查一次




})();