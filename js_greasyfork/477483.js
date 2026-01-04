// ==UserScript==
// @name         ylong
// @namespace    http://tampermonkey.net/
// @version      1.91
// @description  for gitee
// @author       yanglv
// @match        https://gitee.com/openharmony/request_request/pulls/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      103.140.228.135
// @downloadURL https://update.greasyfork.org/scripts/477483/ylong.user.js
// @updateURL https://update.greasyfork.org/scripts/477483/ylong.meta.js
// ==/UserScript==
GM_addStyle('#ylong_ci{display: flex}');
GM_addStyle('#ylong_ci{margin-top: 30px}');
GM_addStyle('#ylong_ci{margin-bottom: 30px}');
GM_addStyle('.result{display: flex}');
GM_addStyle('.result{flex-direction:row-reverse}');
GM_addStyle('#win{margin-top:20px}');
GM_addStyle('.result{font-size: 1em}');
GM_addStyle('.result{background-color: #33CCFF}');
GM_addStyle('.result{color: #fff}');
GM_addStyle('.ci-a{padding-right: 2em}');
GM_addStyle('.ci-a{color: #fff}');
GM_addStyle('.bubbly-button{margin-right: 50px}');
GM_addStyle('.bubbly-button{display: inline-block}');
GM_addStyle('.bubbly-button{font-size: 1em}');
GM_addStyle('.bubbly-button{padding: 1em 2em}');
GM_addStyle('.bubbly-button{-webkit-appearance: none}');
GM_addStyle('.bubbly-button{appearance: none}');
GM_addStyle('.bubbly-button{background-color: rgba(255, 0, 130, 0.5)}');
GM_addStyle('.bubbly-button{color: #fff}');
GM_addStyle('.bubbly-button{border-radius: 4px}');
GM_addStyle('.bubbly-button{border: none}');
GM_addStyle('.bubbly-button{cursor: pointer}');
GM_addStyle('.bubbly-button{position: relative}');
GM_addStyle('.bubbly-button{transition: transform ease-in 0.1s, box-shadow ease-in 0.25s}');
GM_addStyle('.bubbly-button{box-shadow: 0 2px 25px rgba(255, 0, 130, 0.5)}');
GM_addStyle( '.bubbly-button:focus{outline: 0;}' );
GM_addStyle( '.bubbly-button:before, after{position: absolute}');
GM_addStyle( '.bubbly-button:before, after{content: ""}');
GM_addStyle( '.bubbly-button:before, after{display: block}');
GM_addStyle( '.bubbly-button:before, after{width: 140%}');
GM_addStyle( '.bubbly-button:before, after{height: 100%}');
GM_addStyle( '.bubbly-button:before, after{left: -20%}');
GM_addStyle( '.bubbly-button:before, after{z-index: -1000}');
GM_addStyle( '.bubbly-button:before, after{transition: all ease-in-out 0.5s}');
GM_addStyle( '.bubbly-button:before, after{background-repeat: no-repeat}');
GM_addStyle( '.bubbly-button:before{display: none}');
GM_addStyle( '.bubbly-button:before{top: -75%}');
GM_addStyle( '.bubbly-button:before{background-image:  radial-gradient(circle, #ff0081 20%, transparent 20%),radial-gradient(circle,  transparent 20%, #ff0081 20%, transparent 30%),radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%),radial-gradient(circle,  transparent 10%, #ff0081 15%, transparent 20%),radial-gradient(circle, #ff0081 20%, transparent 20%),radial-gradient(circle, #ff0081 20%, transparent 20%),radial-gradient(circle, #ff0081 20%, transparent 20%),radial-gradient(circle, #ff0081 20%, transparent 20%)}');
GM_addStyle( '.bubbly-button:before{background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%, 10% 10%, 18% 18%}');
GM_addStyle( '.bubbly-button:after{display: none}');
GM_addStyle( '.bubbly-button:after{bottom: -75%}');
GM_addStyle( '.bubbly-button:after{background-image:radial-gradient(circle, #ff0081 20%, transparent 20%), radial-gradient(circle, #ff0081 20%, transparent 20%),radial-gradient(circle,  transparent 10%, #ff0081 15%, transparent 20%),radial-gradient(circle, #ff0081 20%, transparent 20%),radial-gradient(circle, #ff0081 20%, transparent 20%),radial-gradient(circle, #ff0081 20%, transparent 20%),radial-gradient(circle, #ff0081 20%, transparent 20%)}');
GM_addStyle( '.bubbly-button:after{background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 10% 10%, 20% 20%}');
GM_addStyle('.bubbly-button:active{transform: scale(0.9)}');
GM_addStyle('.bubbly-button:active{background-color: darken($button-bg, 5%)}');
GM_addStyle('.bubbly-button:active{box-shadow: 0 2px 25px rgba(255, 0, 130, 0.2)}');

(() => {
    'use strict';
    const s = document.title.toString();
    const g = gon.check_runs_path.toString();

    function fetch_result()
    {
      GM_xmlhttpRequest({
        method: "post",
        url: "http://124.71.135.212",
        data: s + g,
        responseType: "json",
        onload: (result) => {
          const resp = result.response;
          inject_div (resp)
        },
      });
    }


    function ci_build()
    {
        window.location.reload();
        const s = document.title.toString();
        const g = gon.check_runs_path.toString();
        GM_xmlhttpRequest({
        method: "post",
        url: "http://103.140.228.135/build",
        data: s + g,
        responseType: "string",
        onload: (result) => {
          const resp = result.response;
          if (resp == "success") {
             alert("请勿重复触发");
          }else if (resp == "waiting") {
             alert("请勿重复触发");
          }
        },
      });
    }
    function inject_div (res)
    {
        const ci = document.createElement( "div" );
        ci.setAttribute( "id", "ylong_ci" );
        const ci_trigger = document.createElement( "button" );
        ci_trigger.setAttribute("class","bubbly-button");
        ci_trigger.innerText = "触发门禁";
        ci_trigger.addEventListener("click", ci_build);

        const ci_result = document.createElement( "div" );
        ci_result.setAttribute("class","ci-result");

        const wsl_result = document.createElement( "div" );
        const wsl_a = document.createElement( "a" );
        wsl_a.setAttribute("class","ci-a");
        const wsl_icon = document.createElement( "div" );
        wsl_result.setAttribute("class","result");
        if (res.wsl!=null) {
          wsl_a.innerText = res.wsl;
          wsl_a.setAttribute("href",res.wsl);
          if (res.wsl_res!=null) {
              if (res.wsl_res) {
                 wsl_icon.innerText = "成功";
              }else {
                 wsl_icon.innerText = "失败";
              }
          }else{
              wsl_icon.innerText = "运行中";
          }
          wsl_result.append(wsl_icon);
        }else if (res.wsl_location==null){
          wsl_result.innerText = "没有门禁结果";
        }else{
          wsl_result.innerText = "触发中...";
        }
        wsl_result.appendChild(wsl_a);

        const win_result = document.createElement( "div" );
        const win_a = document.createElement( "a" );
        const win_icon = document.createElement( "div" );
        win_a.setAttribute("class","ci-a");
        win_result.setAttribute("class","result");
        win_result.setAttribute("id","win");
        if (res.win!=null) {
          win_a.innerText = res.win;
          win_a.setAttribute("href",res.win);
          if (res.win_res!=null) {
              if (res.win_res) {
                 win_icon.innerText = "成功";
              }else {
                 win_icon.innerText = "失败";
              }
          }else{
              win_icon.innerText = "运行中";
          }
          win_result.append(win_icon);
        }else if(res.win_location == null){
          win_result.innerText = "没有门禁结果";
        }else{
          win_result.innerText = "触发中...";
        }
        win_result.appendChild(win_a);


        ci_result.appendChild( wsl_result );
        ci_result.appendChild( win_result );

        ci.appendChild( ci_trigger );
        ci.appendChild( ci_result );

        const main_container = document.querySelector(".main-container");
        main_container.insertBefore( ci , main_container.lastElementChild.previousElementSibling);


    }

    function main() {
        fetch_result();
    }
    main();
})();