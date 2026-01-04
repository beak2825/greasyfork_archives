// ==UserScript==

// @name              麻豆传媒|观看vip付费视频
// @homepage          https://vip.yotade.cc
// @version           1.0.13
// @updateDesc        观看全站vip付费视频
// @description       🔥观看全站vip付费视频，复制播放链接，下载视频(日限)，去广告🔥
// @icon              https://vip.yotade.cc/static/madou.png
// @namespace         https://vip.yotade.cc/detail?app_id=0004
// @author            yota
// @include           *://dmkgi61to70tx.cloudfront.net/*
// @include           *://d166ds52bymjz3.cloudfront.net/*
// @include           *://d1ojl4419qh989.cloudfront.net/*
// @require 		      https://cdnjs.cloudflare.com/ajax/libs/vue/2.1.8/vue.min.js
// @require 		      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.8/hls.min.js
// @run-at 			      document-end
// @grant             unsafeWindow
// @grant             GM_info
// @grant             GM_addStyle
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_deleteValue
// @grant 			      GM_getResourceText
// @grant             GM_xmlhttpRequest
// @charset		        UTF-8
// @antifeature       payment
// @license           MIT


// @downloadURL https://update.greasyfork.org/scripts/526840/%E9%BA%BB%E8%B1%86%E4%BC%A0%E5%AA%92%7C%E8%A7%82%E7%9C%8Bvip%E4%BB%98%E8%B4%B9%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/526840/%E9%BA%BB%E8%B1%86%E4%BC%A0%E5%AA%92%7C%E8%A7%82%E7%9C%8Bvip%E4%BB%98%E8%B4%B9%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

function startScript() {
  var el = document.getElementById("yota-plugin");
  if (el) {
    //防止重复安装导致页面卡死
    return;
  }

  const div = document.createElement("div");
  div.id = "yota-plugin";
  div.innerHTML = "<yota_comp></yota_comp>";
  document.body.appendChild(div);
  new Vue({
    el: "#yota-plugin", // Vue 实例挂载的元素
    data: {},
    methods: {},
    mounted() {
      GM_addStyle(`
                 
    * {
        margin: 0;
        padding: 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }

    #yota-plugin {
        position: fixed;
        z-index: 10000;
    }

    .yota {
        position: fixed;
        left: 0;
        top: 0;
        width: 0;
        height: 0;
    }

    .yota-bar {
        position: fixed;
        right: 0;
        top: 50%;
        transform: translate(0, -50%);
        /* -webkit-transform: translate(0, -50%); */
        width: 46px;
        /* height: 200px; */
        margin-right: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
        backdrop-filter: blur(8px);
        background-color: rgb(125, 125, 125, 0.5);
        border-radius: 10px;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .yota-hr {
        margin-top: 5px;
        margin-bottom: 5px;
        width: 100%;
        height: 1px;
        background-color: rgb(183, 183, 183);
    }

    .yota-avatar {
        width: 33px;
        height: 33px;
        padding: 2px;
        overflow: hidden;
        border-radius: 50%;
        text-align: center;
        background-color: rgb(224, 224, 224);
        margin-top: 4px;
        margin-bottom: 4px;
    }

    .yota-user-valid::after {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: rgb(21, 21, 248);
        position: absolute;
        top: 8px;
        right: 6px;
    }

    .yota-avatar-img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: rgb(237, 237, 237);
    }

    .yota-play {
        width: 46px;
        height: 46px;
        position: relative;
    }

    .yota-play-img {
        width: 100%;
        height: 100%;
    }

    .yota-parsing::after {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: rgb(237, 237, 237);
        position: absolute;
        top: 6px;
        right: 6px;
    }

    .yota-can-play::after {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: rgb(53, 205, 53);
        position: absolute;
        top: 6px;
        right: 6px;
    }

    .yota-bar-left {
        position: fixed;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
        /* -webkit-transform: translate(0, -50%); */
        width: 46px;
        /* height: 200px; */
        margin-left: 10px;
        /* padding-top: 10px;
        padding-bottom: 10px; */
        backdrop-filter: blur(8px);
        background-color: rgb(125, 125, 125, 0.5);
        border-radius: 10px;

        display: flex;
        flex-direction: column;
        align-items: center;

        /* transform: translateX(0); */
    }

    .slideleft-enter-active,
    .slideleft-leave-active {
        transition: transform 0.3s ease;
    }

    .slideleft-enter,
    .slideleft-leave-to {
        transform: translate(-60px, -50%);
    }


    .slideright-enter-active,
    .slideright-leave-active {
        transition: transform 0.3s ease;
    }

    .slideright-enter,
    .slideright-leave-to {
        transform: translate(60px, -50%);
        /* -webkit-transform: translate(60px, 50%); */
    }

    .yota-visible {
        width: 46px;
        height: 46px;
        position: relative;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .yota-visible-img {
        width: 35px;
        height: 35px;
    }

    .yota-download {
        width: 46px;
        height: 46px;
        position: relative;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .yota-download-img {
        width: 30px;
        height: 30px;
    }

    .yota-can-download::after {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #fc2f33;
        position: absolute;
        top: 6px;
        right: 6px;
    }

    .yota-tips {
        width: 46px;
        height: 46px;
        position: relative;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .yota-tips-img {
        width: 35px;
        height: 35px;
    }


    .yota-invisible {
        width: 46px;
        height: 46px;
        position: relative;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: -2px;
    }

    .yota-invisible-img {
        width: 35px;
        height: 35px;
    }

    .yota-can-tips::after {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: rgb(210, 100, 52);
        position: absolute;
        top: 6px;
        right: 6px;
    }

    .yota-login-back {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10001;
    }

    .yota-login {
        position: fixed;
        width: 200px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        margin: 0;
        border-radius: 25px;
        border: none;
        background-color: white;
    }

    .yota-login-inner {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 10px 10px;

    }

    .yota-login-close {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 20px;
        height: 20px;
    }

    .yota-login-close img {
        width: 100%;
        height: 100%;
        display: block;
    }

    .yota-login-title {
        text-align: center;
        font-size: 15px;
        margin-top: 10px;
        margin-bottom: 15px;
        font-weight: 500;
        color: rgb(144, 144, 144);
    }

    input:focus {
        outline: none;
    }


    .yota-account {
        margin: 15px 0;
        padding: 0 5px;
        height: 25px;
    }


    .yota-account-input {
        display: block;
        font-size: 12px;
        width: 100%;
        height: 100%;
        padding: 0 10px;
        box-sizing: border-box;
        border-radius: 25px;
        background-color: rgb(230, 230, 230);
        border: none;
        color: black;
    }

    .yota-password {
        margin: 15px 0;
        padding: 0 5px;
        height: 25px;
    }


    .yota-password-input {
        display: block;
        font-size: 12px;
        width: 100%;
        height: 100%;
        padding: 0 10px;
        box-sizing: border-box;
        border-radius: 25px;
        background-color: rgb(230, 230, 230);
        border: none;
        color: black;
    }

    .yota-vcode {
        margin: 15px 0;
        padding: 0 5px;
        height: 25px;
        display: flex;
        flex-direction: row;
        /* box-sizing: border-box; */
    }

    .yota-vcode-input {
        flex: 1;
        height: 100%;
        font-size: 12px;
        width: 110px;
        padding: 0 10px;
        box-sizing: border-box;
        border-radius: 25px;
        background-color: rgb(230, 230, 230);
        border: none;
        margin-right: 10px;
        color: black;
    }

    .yota-vcode-img {
        display: block;
        height: auto;
        width: 50px;
    }

    .yota-login-div {
        text-align: center;
        margin: 15px 0 4px 0;

    }

    .yota-login-btn {
        height: 30px;
        width: 80px;
        font-size: 12px;
        color: #fff;
        border: none;
        border-radius: 30px;
        background: linear-gradient(318deg, #15f1a3, #16eae1);
    }

    .yota-other {
        display: flex;
        margin: 20px 0 1px 0;
        font-size: 12px;
        padding: 0 10px;
        justify-content: space-between;
    }

    .yota-register {
        font-size: 12px;
        color: #15f1a3;
    }

    .yota-register:hover {
        cursor: pointer;
    }

    .yota-charge {
        font-size: 12px;
        color: #15f1a3;
    }

    .yota-charge:hover {
        cursor: pointer;
    }

    .yota-question-back {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10002;
    }

    .yota-question-card {
        /* 剧中 */
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);

        width: 200px;
        border-radius: 25px;
        background-color: #fff;
        border: 2px solid #fffdfd;
        /* 边框 */
        box-shadow: 0 2px 12px 0px rgba(204, 203, 203, 0.5);
        /***** 阴影参数 *****/
    }

    .yota-question-info {
        font-size: 12px;
        color: rgb(0, 129, 255);
        text-align: center;
        font-weight: 500;
        margin-top: 15px;
        letter-spacing: 1px;
        padding: 0 20px;
    }

    .yota-question-icon {
        padding: 20px 30px;
        padding-bottom: 10px;
    }

    .yota-question-img {
        height: 120px;
        width: 120px;
        margin: auto;
        /* 只会左右剧中 */
        background-image: url('data:image/png;base64,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');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        animation: question-img-spring 2s ease-in-out infinite alternate;
    }

    @keyframes question-img-spring {
        0% {
            -webkit-transform: scale(1);
            transform: scale(1);
        }

        100% {
            -webkit-transform: scale(1.1);
            transform: scale(1.1);
        }
    }

    .yota-question-btns {
        display: flex;
        justify-content: space-between;
    }

    .yota-question-btns button {
        display: block;
        /* inline-block会导致无法居中 */
        width: 70px;
        height: 30px;
        line-height: 28px;
        border-radius: 20px;
        font-size: 10px;
        font-weight: 600;
        margin: 15px auto;
        margin-top: 10px;

        background-color: #fff;
        outline: none;
        border: 2px solid #fffdfd;
        /* 边框 */
        box-shadow: 0 2px 12px 0px rgba(204, 203, 203, 0.5);
        /***** 阴影参数 *****/
    }

    .yota-question-cancel-btn {
        color: #c5c5c5;
    }

    .yota-question-confirm-btn {
        color: #666;
    }

    .yota-realdown-back {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10003;
    }


    .yota-realdown-card {
        /* 剧中 */
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);

        width: 200px;
        border-radius: 25px;
        background-color: #fff;
        border: 2px solid #fffdfd;
        /* 边框 */
        box-shadow: 0 2px 12px 0px rgba(204, 203, 203, 0.5);
        /***** 阴影参数 *****/
    }

    .yota-realdown-close {
        position: absolute;
        top: 8px;
        right: 8px;
        /* padding: 12px; */
        width: 20px;
        height: 20px;
        background-size: cover;
        background-repeat: no-repeat;
        z-index: 10;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAADEpJREFUeF7tnVl22zwMhSNnR83xc9OVpVlZ3eeedEex/kP9ZirLGjgAJIabh44SBV7czyAo2R6e8MOmwJ8/f17D4KfTafo9/AzD8H3tguM4fh0zO/YyP3Ycx9/zv1+v18v5fL47hm0yTgcenM6bdNpzECIAa4YnvehisGEYLnOAAA+N2gCkQMcAxPPz81s4tTUIBeGGU97DLy8vLz8Lz3d7GgBJSL1CIDZnNa80AOY4+QBkRaMAROgbwnJJSYU4zvTGEREYLMnWBQIgN11iHxGWTtahOKDpHZXln0LuAYnLJ+dQrDGDviXsOhbXZsUnAors5LmFxRUgACMbjNXK4mkJ5gIQgEECxnIQF72KaUAABgsYrkAxCQjAaAKGC1BMAfLx8RHuFE93uPHTTQFTSy8TgKBidINh9cLx5qOFZl49IKgasuBYRKO+mqgF5PY4yC/R9kBwUQG1oKgDBMsptdSphEQVIFhOqYVjHrgqUNQA8vfv3194XsoEIGESaiARDwh6DTNQqHxsRTQgWFKZhkNFAy8WECypXMAhHhJxgGCXyhUYd5O9Xq8/pH1KiyhAsKTyC8ds5qIaeDGAAA7AIRESEYAADsCxooCIStIdEMABOHYU6A5JV0CwUwU4EhToCkk3QABHgjVwyKRAeHz+27dvP3rI0QUQwNEj1bqv2QuS5oAADt1G7Rl9D0iaAoKGvKe9bFy7NSTNAAEcNgwqZBbNGvcmgAAOIbayFUYTSNgBARy2XClsNuyQsAICOITZyWY4rJCwAYI3Otl0o8RZcT4FzAbIx8fHKFFMxGRTgZeXFxYvswyKpZVNE0qeFdf2LzkggEOyjczHRt6PkAICOMwbUPwEqfsRakDQd4i3kP0AKfsRMkBQPewbT8sMKfsREkAAhxbruIqTpB+hAgRLK1fe0zFZin6kGhBUDx1m8RglxVKrChDA4dF2uuZcW0VqAcHSSpdfXEZbs6tVDAiqh0uvaZ10ccNeBAjg0OoTv3GXLrWKAMH7yv0aTevMSxv2bEBQPbRaBHGXfHFPCSBozOE1tQrkNuxZgKB6qPUFAr8pkNuL5AKC6gGrqVYgtxdJBgTVQ7UvEPxMgZwqkgMIqgdsZkKBnCqSBAiqhwlfYBIFVSQVEFQP2MuUAqlV5BAQVA9TvsBkMqtICiCoHrCVSQVSqsguIPjwN5O+wKQyqsguIFhewUvWFTiqIkeAYHll3SGY39Pe4yebgHivHuFmUvDO+Xy+3LQIf32z4Kfwqvn5+fke5nI6nV5vczIxt5L87N04BCALRfdKrpEXjc03D3l9G8NezvcA8bi8OnznmXJIDufnFZKtKrIKiHITlFTZcM6heeLASvVJnp9HSHIB8VY9ks2jFJLs+XmDZGuZ9VBBPN77yH0TjTJIsuGYzc/VC+VaFXkAROnyoXRZlbW0WruIcL2K4Qhzdfhi+aDXAyDeSmtO77FFoVBIquDwCMjaMmutgrgvqyXlSBgk1XB4XWYtl9t3gAhLcolPs8/JeXfZ0eBC9KOE46eVm6NHuYv/v/SDe0COnsVJFVZI404GR5iPEOBzU1B1/NIPd4A47D+imBaMZWEOVeamOHkXEOdf3azZYJpjp/A16RjzZdZXBfFYTldU1Wg0jTGTGpp6MACyr6gmw2mKldrHbOPNl1nzCuJqe/dAXQ3G0xAjm4k5BwYgaepKNqDk2NLUFX5UvB8yVRCHjxSkpkeiESXGlKqnmuNiHzIBggZ9N2+SDCkpFjVmLwkUgOSpJsGYEmLIU0330ZPeqCDpSexp0J7XTlfI0JGxUZ8AcXwHPTelPYza45q5upg7/g4Q53fQc5Pb0rAtr5Wrg/njw05WXGLhHkheulsYt8U18mbt7OjQqA/Y4i3OOqeBOccunrC3EydAsMVblXYOI4dP+gvvwyD5QX6rZHwHIFX6TSeTQlIfzr8RAEe1mgCkWsL/BxAHCeAgySwAIZFRGCSAgyarYat3wD0QGjFvo3SvJICDLp8AhE7L+UjdIAEctAkFILR6doUEcNAnE4DQa9oFEsDBk0gAwqNrU0gAB18SJ0DwHBafwNyNO+Bgz90TAOHXmOU+CeBokzgA0kZn8p0tANImcQCEX2dyOGLIgIQ/ebhRyKsxGxyAhDdxcXQAwqczOxyAhC95YWRs8/Lp2wwOQMKXRADCo21zOAAJTyIBCL2u3eAAJPTJjDcK3X2LEL2U04jd4QAk5JnF+0GIJBUDByAhyuj/wwAQAjnFwQFICLIaAcGnmlSJSQrH7cYfPrShKiWkJ7/jY3/K9eSA4+0WDufY5TN2diY+F6s84S0M3OIa5Qo4OBOfrFiW5JbGbXmtMjUMn/UFCD64ITnLPQzb45rJglg9EJ/unp/Znkbtee18pWycMWmO7wdJS6YEg0qIIU0tG0f9AwRbvbsZlWRMSbHYwGB7FgAkIcMSDSkxpgQpdR1y9x2FIXR8eMNDAiUbUXJsukjYiPbua6DDMdjJulNKgwE1xKgWFgBysPakyizz+8YBCVWi7sf50nXaxQo/aNQnGTQaTmPMPLamG/UREPQhKuGIlgAkdHCEh0W/CsfXH5z3IRYMZmEOhDYvGyreQY9nAxCdy6qt7JNC4nTj5k7DO0Cc9iFkpmJuyFNfEsnmAz88Pd0B4rEPma83Ux24dpwQOEh7Eo+ALP3wAIi3shrvmBqCgwwSYdDXpCjp3GX/EU5aqyCuPuWkFhDhJqpabgmfW5LpMw960OsBEJTVdEmVGKgYEm+PH629WD4A4nG7d620HmGiBI7i5Za3pXYQaq0fXQXEYxXJuYuuDI5sSDzCsZV/AHJfKg6XI0rhSIbEKRyr1WO1SY9KehVqr5Ioh+MQEuT8cWG9WkHCYU6XWXOF3sNfrtfrJfz+/Pz8No7j61FvouT/p7mF91yHPIc/n06nX0pi5whzc+WwCUiIwtsuBofyGFO+Ans3i3cBcVxy5WcVEVIpsNt37gKCZRZVDjCOYAXKAfF4T0RwIhEagwJHz+LtVhA06wwZwZCSFDjc1j8EBFVEUj4RC6UCR9UjXCsJEPQilGnBWEIUOKweyYCgighJKcIgUyClemQBgipClhsM1F+BpOqRBQiqSP+sIgIaBVKrRzYgqCI0CcIoXRVIrh7ZgKCKdE0sLk6gQE71KALEyBOtBFJjCIUKZFWPIkBQRRTaAiE/lbxrtBgQ9CJwnEIFsqtHMSDhRCy1FFrEb8hFcFQBcoNk9Ks5Zq5FgdzGfD6vpEdNtoTAUkuLRVzHWVw9qisIGnbXxtMw+So4SABBFdHgE58x1iytomJVS6w4CBp2nwYUPuvq6kFSQaJIeP+6cLv4Co8EDlJAsKvly4GSZ0uxtCJdYsXB0I9Ito2b2MiqB3kFuVURV1+f4MZ2OiZKCgcLINj61eEkg1GSw8EGCCAxaD/hU6LsO+ZTJdnmXdMO/YhwRxkKr/ZbwvakYAME/YghB8qeCsvSimUXa01H3ESU7S7l0bHCwdqDzIUHJMptKDN8djiaAYLllkyHKY6qCRxNAcHOlmI7ygq9GRzNAQEkspymLZrS95XXzJN1F2srMDzYWJMyn+f2gKNLBYnpBSQ+jV4y615wdAUEjXuJVfyd0xOO7oAAEn+Gz5xx04Z8LbYuPcgyENwnybSNj8O7wyGigsRcAxIfrk+cpQg4RAGC5VaidewfJgYOcYCEgPAUsH0CtmbI+VRuqaoiepC14LHkKk2pvvN671TtKSYWECy59Bm9MGJRS6rlHEQDAkgKLafkNIlLKnWAYJdLidszwpS8pFILCKpJhgNlHyp6SaUaEFQT2c7fbXaH4fL5+fl+Pp8vmmYhvgfZEhO7XHpspqHX2FJTLSCoJioAUbWcWlNUPSCxNxmG4fs4jq8qbGM8yNCEa1xOmQUE1UQUceqrxlxNExVkaQ/0J22BsVQxTOxipaYfoKQqVXacZTCiIiYrCCpKmeFTz/IAhitA0KOkWn//OE9guAQkTvr2SH3Y8XqjsY7tUTyC4RqQuZ1vfUr4J8AyE8YzFOZ3sUpfz7039RGKoJ+2R0JKc350nosm/UiE5f/HJZiHm48BinEcf1+v1wugeHQKAEmgJy7DLAATgAhTtnKnOyF9VYcAkAL5NPUtAKIgwfNerO50nB0UmO2KTYL0qDQRhLhcQh9B401UEBodN0dZwhMBmp+w9pBlNPxy4ABA/LfQNwAE3gT+B2zGwf4HJibRAAAAAElFTkSuQmCC');
    }

    .yota-realdown-info {
        font-size: 12px;
        color: rgb(0, 129, 255);
        text-align: center;
        font-weight: 500;
        margin-top: 40px;
        letter-spacing: 1px;
        padding: 0 20px;
    }

    .yota-realdown-icon {
        padding: 20px 40px;
    }

    .yota-realdown-btns {
        display: flex;
        flex-direction: column;
        margin: 10px 0;
        margin-bottom: 30px;
    }

    .yota-realdown-btns button {
        display: block;
        /* inline-block会导致无法居中 */
        width: 150px;
        height: 36px;
        line-height: 33px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        margin: 8px auto;
        color: #666;
        background-color: #fff;
        outline: none;
        border: 2px solid #fffdfd;
        /* 边框 */
        box-shadow: 0 2px 12px 0px rgba(204, 203, 203, 0.5);
        /***** 阴影参数 *****/
    }

    .yota-realdown-btn.copy {
        background-color: orange;
        color: white;
        border: none;
    }



    .yota-loading {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        margin: 0;
        padding: 0;
        width: 60px;
        height: 80px;
        border: none;
        background-color: rgba(255, 255, 255, 0);
        z-index: 10021;
    }

    .yota-container {
        width: 0;
        height: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .yota-ball {
        width: 15px;
        height: 15px;
        background-color: #333;
        border-radius: 50%;
        position: absolute;
        /* top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%); */
        /* 这样写 居中 会导致 添加以下动画的元素无法居中*/


    }

    .ball1 {
        background: #ed872d;
        border-radius: 50%;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
        animation: leftLoad infinite linear 0.4s;
    }

    .ball2 {
        background: #eaaa65;
        border-radius: 50%;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
        animation: rightLoad infinite linear 0.4s;
    }

    @keyframes leftLoad {
        0% {
            transform: translateX(0px) scale(1);
            z-index: 2;
        }

        25% {
            z-index: 5;
            transform: translateX(10px) scale(1.2);
        }

        50% {
            z-index: 2;
            transform: translateX(20px) scale(1);
        }

        75% {
            z-index: 1;
            transform: translateX(10px) scale(0.8);
        }

        100% {
            transform: translateX(0px) scale(1);
            z-index: 2;
        }
    }

    @keyframes rightLoad {
        0% {
            transform: translateX(0px) scale(1);

            z-index: 2;
        }

        25% {
            z-index: 1;
            transform: translateX(-10px) scale(1.2);
        }

        50% {
            z-index: 2;
            transform: translateX(-20px) scale(1);
        }

        75% {
            z-index: 5;
            transform: translateX(-10px) scale(0.8);
        }

        100% {
            transform: translateX(0px) scale(1);
            z-index: 2;
        }
    }

    .yota-loading-close {
        /* position: absolute;
        top: 20px;
        left: 50%;
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%); */
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin-top: 55px;
    }

    .yota-loading::backdrop {
        background: rgba(0, 0, 0, 0.3);
    }



    .yota-loading-close-btn {
        display: block;
        height: 20px;
        width: 20px;

    }


    .yota-toast {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        margin: 0;
        padding: 0;
        /* width: auto !important; */
        /* 写了会导致 宽度 不自适应 */
        /* height: 20px; */
        border: none;
        border-radius: 8px;
        font-size: 14px;
        max-width: 200px;
        padding: 4px 10px;
        color: white;
        background-color: rgba(0, 0, 0, 0.8);
        text-align: justify;
        word-break: break-all;
        word-wrap: break-word;
        z-index: 10031;
    }

    .yota-toast::backdrop {
        height: 0;
        width: 0;
    }

    .yota-info-back {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10002;

    }

    .yota-info {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        margin: 0;
        padding: 0;
        width: 310px;
        height: 370px;
        border-radius: 25px;
        border: none;
        background-color: white;
    }

    .yota-info-inner {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 10px 10px;

    }

    .yota-website {
        font-size: 14px;
        text-align: center;
        color: transparent;
        line-height: 35px;
        letter-spacing: 2px;
        margin: 0;
        padding: 0 16px;
        background: linear-gradient(to right, #000 0, #ffff00 20%, #000 40%);
        background-position: -100px 0;
        -webkit-background-clip: text;
        animation: eff71 4s linear infinite;
        cursor: pointer;
    }

    @keyframes eff71 {
        to {
            background-position: 500px 0;
        }
    }

    .yota-info-close {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 20px;
        height: 20px;
    }

    .yota-info-close img {
        width: 100%;
        height: 100%;
        display: block;
    }

    .yota-user {
        margin: 10px 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .yota-user-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        background-color: rgb(200, 200, 200);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .yota-user-avatar-img {
        display: block;
        height: 46px;
        border-radius: 46px;
        width: auto;
    }

    .yota-user-name {
        margin-left: 13px;
        font-size: 15px;
        max-width: 100px;
        color: rgb(144, 144, 144);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }

    .yota-user-logout {
        display: block;
        width: 80px;
        height: 30px;
        border: none;
        margin-left: 16px;
        font-size: 14px;
        border-radius: 20px;
        background-color: #cccccc;
        color: #9a9a9a;
    }

    .yota-apps {
        border-top-width: 1px;
        border-bottom-width: 1px;
        border-top-color: rgb(215, 215, 215);
        border-bottom-color: rgb(215, 215, 215);
        border-top-style: solid;
        border-bottom-style: solid;
        height: 250px;
        padding: 0 10px;
        overflow: scroll;
    }

    .yota-app {
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .yota-app-info {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .yota-app-icon {
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 10px;
    }

    .yota-app-name {
        margin-left: 10px;
        font-size: 13px;
        font-weight: 500;
        color: rgb(95, 95, 95);
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }

    .yota-app-go {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .yota-app-web {
        height: 30px;
        font-size: 14px;
        border-radius: 12px;
        padding-left: 6px;
        padding-right: 6px;
        margin-right: 5px;
        border: none;
        background-color: #bcba2e;
        color: white;
    }

    .yota-app-charge {
        height: 30px;
        font-size: 14px;
        border-radius: 12px;
        padding-left: 6px;
        padding-right: 6px;
        border: none;
        background-color: #15f1a3;
        color: white;
    }

    .yota-notice-back {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10003;
    }

    .yota-notice {
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%);
        margin: 0;
        padding: 0;
        width: 300px;
        min-height: 100px;


        border: none;
        border-radius: 10px;
        background: repeating-linear-gradient(-45deg,
                #e8544d 0px 10px,
                #fff 10px 20px,
                #75adf8 20px 30px,
                #fff 30px 40px) -20px -20px/200% 200%;

        padding: 5px;
        transition: 0.5s;

    }

    .yota-notice:hover {
        background-position: 0 0;
    }

    .yota-notice-card {
        background: #fff;
        border-radius: inherit;
        inset: 5px;
        padding: 24px 16px 14px 16px;
        min-height: 90px;
    }

    .yota-notice-card p {
        font-size: 14px;
        margin-bottom: 10px;
        color: black;
    }

    .yota-notice-close {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 15px;
        height: 15px;
    }

    .yota-notice-close img {
        width: 100%;
        height: 100%;
        display: block;
    }

    dialog:focus-visible {
        outline: none;
    }


    .yota-player-back {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10003;
    }

    .yota-player-container {
        position: absolute;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%);
        margin: 0;
        padding: 0;
        width: 352px;
        min-height: 180px;


        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .yota-player {
        width: 100%;
        min-height: 198px;
        max-height: 400px;
        background-color: #565656;
    }

    .yota-player-container button {
        display: block;
        width: 60px;
        height: 30px;
        border: none;
        border-radius: 30px;
        background-color: #4a4a4a;
        margin-top: 20px;
        color: white;
        font-size: 14px;
        line-height: 30px;
    }


    
       

                        `);
    },
    components: {
      yota_comp: {
        // 组件名，在父组件中使用标签方式即可
        // 定义组件模板，来自定义的script标签模板
        // template: "#template1",
        template: ` 
            
<div class="yota">

    <transition name="slideright">
        <div class="yota-bar" v-show="this.bar_visible">
            <div :class="{'yota-avatar':true,'yota-user-valid':this.userInfo.valid}" @click="avatarClick()">
                <img class="yota-avatar-img" :src="this.avatar" />
            </div>
            <div class="yota-hr"></div>
            <div :class="{'yota-play':true, 'yota-parsing':this.play_state === 'parsing', 'yota-can-play':this.play_state === 'success'}"
                @click=" play()">
                <img class="yota-play-img"
                    src="data:image/png;base64,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" />
            </div>
            <div class="yota-hr"></div>
            <div :class="{'yota-download':true, 'yota-can-download':this.can_download}" @click="download()">
                <img class="yota-download-img"
                    src="data:image/png;base64,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" />
            </div>
            <div class="yota-hr"></div>
            <div :class="{'yota-tips':true, 'yota-can-tips':this.has_notice}" @click="viewNotice()">
                <img class="yota-tips-img"
                    src="data:image/png;base64,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" />
            </div>
            <div class="yota-hr"></div>
            <div class="yota-invisible" @click="toggleVisible()">
                <img class="yota-invisible-img"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAADEZJREFUeF7tnUGS2zgMRW33jeLKOsnJOn2yTNapzo3SnqLTymgUyaJAEATIl8XUVJukwP/xBFKW5POJfyiAApsKnNEGBVBgWwEAITtQ4IECAEJ6oACAkAMoIFOACiLTjV6DKAAggxjNNGUKAIhMN3oNogCADGI005QpACAy3eg1iAIAMojRTFOmAIDIdKPXIAoAyCBGM02ZAgAi041egygAIIMYzTRlCgCITDd6DaIAgAxiNNOUKQAgMt3oNYgCADKI0UxTpgCAyHSj1yAKAMggRjNNmQIAItONXoMoACCDGM00ZQoAiEw3eg2iAIAMYjTTlCkAIDLd6DWIAgAyiNE9TfPHjx+fP378+I/FnADEQmWOoabA6+vr19Pp9Hw6nV6u12v6/6r/AKSqvAyuqcAMjmnY6pAAiKaDjFVNgRU4TCABkGqWMrCWAg/gqA4JgGi5yDhVFMiAoyokAFLFVgbVUOAAHNUgARANJxlDXQEBHFUgARB1axmwVIECONQhAZBSN+mvqoACHPd43t7evmh8mQggqvYyWIkCWnBofokIICWO0ldNAY9wpMkBiJrFDCRVwCscACJ1lH5qCniGA0DUbGYgiQLe4QAQiav0UVEgAhwAomI1gxxVIAocAHLUWdoXKxAJDgAptpsBjigQDQ4AOeIubYsUiAgHgBRZTudcBaLCASC5DtNOrEBkOABEbDsdcxSIDgeA5LhMG5ECPcABICLrj3dK73G6XC6fp57n8/nTfJTb7fbns/nfz+fzX+9+ut1u39/e3u5/17id+/hs9nv0AgeA7Ht9qMUchATBVuIfGjSj8QTSr1+/XlqD0xMcAJKRfI+aTEBYwpAbcoJmqjZWlaY3OAAkN9tm7d6TIP0lvd0vzL8ETKowtWDpEQ4AyUzvZL7HKpEZ/l/NtGHpFQ4AeZBhUSvFAWhUXtvZMxwAspJNioYfyFXzpsCRKTmP3J5OpwGqxTwdgCMTjuEryGBgJL+B4wAcwwIyIBjAcRCMqflQS6xBwQAOIRxDVZBBNt9rqcCyCkC2FRgYDCpHARjdL7Fm90WF+sZbwdNpCCqHgphd7kEGrxpUDgUwuq0gwMGlXEU++nk3L2Dc04JllSYdvby8Gjj8wZFuiPzw4cMX5Xw1Hy78HuTnz5/frB5Mqu3O9OCTYD7eKofqhYLauj8aPywg71epvrUUT3Ls+YNMqf/e8xlpnqldemR345Z7r3Dc5YleSUICEnBJdX8U9nq9fpVANe8zAfP09PScnhjUGNNCT62fRCvV72j/cIBYmHlUxAftVc7uivH8NZSlnhEhCQWIpZmFSekejDS/RnqG0Cbc9yCNzDzKSRjzG+sZRqcQFaSxmVmQRFo+ONEzBCTuAXFi5iYk0a7SONPTPSSuAXFm5hok7g2eB+1UT9caugXEqZnzfHNt7JJmz3p6Xp66BCTAl4DAkbUzy2/kFRJ3gABHflLltPRcOebxe93LuQPE871VXk3cAiUKHH++c3B4g6MrQLwber1eVfVa3meVEkXr/bnetYxy94Gq4TklP+rZTmuNnKBI91ElHVbu2lXZ2wSGY0oPFR1K8tHVN+ne9x0aS6sJjAe3sqskRQdw3HNT64RUComLCuJ535EELl1aZSQtcCwyWeOkVApH6t8ckIzk0ZhnyRhFyZsxv6Lxp4llHKdEg1Z9VbQpCb4pIN6XVqXVI6MyqiRAp3C4WGo1BSQjgUrgL+5bsg7OmBtwZDjUeqnVDJAIZz3p3iNjbsCRAcesiYpexw75u3UTQCIsraRnroBwvKSflb5cLq6f7y+p5hIwml7mzVh+lMxJpa/UkNfX19uDAFTOhBkQ5mpwj6fnE1auEFvtzCtIBDOkm/OdxHUJx5QYPZ+0SiAxBySCEQXLq63q4RqOlEA9+xIGkCjVQ7K8elA93MOREqhnb8IAEuEslcSUALIxtxBwRAJEWt2lkJgtsaKcoaSArGzOw8ARCRCpP+4BiVI9JBv0leVVKDim5Nm5AifNMfV+llXErIJEEV8BkJBwpHn37JGUUhNAIi2vCgEJC0eUK1mzRFfReg8cE0AiLa8k5ft9fu5eJH30VpnefdqDYe1zE0AUv/mVzPFQHwkgqULu/YxBThCaOknmEQkQSaXP8WDZBkBWVDt65pUIv+yjCUcaWwJIpD2I1s/N7XlnAggbwMc2aMPxfrTDa/RIgFidxCwBST8eE+I3y63Efz9x1NKlZ0AOz22vUmx9bgZIpCoi+SZdYkClynEP5egcgl1p7BaQWmdLSX5u9jmaXJKD14RDsoGNBIhlhTetIIGqSNUzVG04JBtYg5gk55G1PlW9aXIVa37QCEZIrgDlum80/8NJFOQS7+F55friYg8yBRHhakmNMu4VDir7NkbmS6zKV25KTxjz/qpnKyM4RC+5s4qt0BxVP3JjaQJIkDOWmiGGCSiK2TC+3LxsvveYAmgJiPcrWqJkWzprmHzieAMsecVzKyEy9W0GiPOlloohVnCUXFSwirEkUWvsB3PjaQqI06XWMHA41X+Zuyp+5ALR/DJvwyVIjkYqZhielYviNYwzR3s3+455IM0riKOlVlGyzS5hW+2tiuP1vvdoubRqvklfqSSP3kgoPQPl9itONkPQI8Waq7/L6tF8kz5XpWG5d59waROefrsw6aXxYFaA+65UPCmh010FMTwDz3VTMUIL7gTC7Xb7ngJML5TWAsJZtd7LWxVP9g6S+7mLPUijSqJihBYckhsMc02et/N+z5WHfYe7TfrSaAMTh4RDEWYJm7t9LB4z2A1i0cBdBZldDaq1aQeOo1li017FF+1Q3QJSaSOpYoLimVglnr2kUIx371DSz010kATnFpAKm3YVExSTTSWePdMV4907lPRzEx2kwbkGRBESFRMUk00lnj3TDfZyeyHsfW6iw14Qjz53D4gCJComRIKj0vK0JM/W+qr4oh3UcrwQgBRAomJCJDgCVI1kp4ovteFI44cBRACJiglR4FCMs3beqfhSO8hp/FCApKAzlw8qJigmnUo8a0mRqYdVPu0dp5oOeweWfh4OkAmSp6en59vt9nll4iomKMJxX1Kk/6SfXJYaNe+XoHgwf41D1BhDxZcagYXfpG9NYGW9rWKCMhz/C3+63yr3XqsEwzRAQCjuoXv8hjwXtJAVZD65GSTu4dgzJcGT2mxUxr3u7j4veRTYy2TCAzItuTRuA69ZObwYbhiHygnLMN7VQ3UBiIaIwKGh4u8xIi+plioAyO8fr7R6TFYvCx2OND3YpVHNvUxveECAQy0Vu1hSUUFmCgBHORw9Vo25KsNWEOAoh6OnvcaWGkMCAhxlcPRw+TZXgeEAAY7c1Pi7Xe/LqTVlhgIEOGRwjAjGpNQwgADHcThGBmMoQIDjGByA8Z9e3VcQ4MiHAzBW9l358sVrCRz7ngHFY426rSCKcLykW9Mvl0u67fx5P+X8twCKfI+6BEQTjuVDTu9P8IWDRfsF2PkpFrtld4DUhGNp9QyW9JGr6jI9W5LeCt/TzYPWuHUFiCUcW0a9x3A6n8+frB58msOQ4gIIPYy6AcQDHFu2LCrNHZ552y2QpsRftP0+Pa4LDHogbI3UBSCe4ahvIUeoqUB4QICjZnowdmhAgIMErq1AWECAo3ZqMH5SICQgwEHyWikQDhDgsEoNjhOuggAHSWutQJgKAhzWqcHxwlQQ4CBZWyngvoIAR6vU4LjuKwhwkKStFXBbQYCjdWpwfLcVBDhITi8KuKsgwOElNYjDXQUBDpLSmwJuKghweEsN4nFTQYCDZPSqQPMKAhxeU4O4mlcQ4CAJvSvQrIIAh/fUIL5mFQQ4SL4oCphXEOCIkhrEaV5BgIOki6aAWQUBjmipQbymFeT95WnfCmXv8qeGCzWhe0UFzCpImkMhJMBRMREYel0BU0AKIAEOMriJAuaACCABjiapwUFN9yBLuTOXW8BBnjZVoEkFmWa8AwlwNE0NDt60guxAAhzkpwsFmlaQDUiAw0VqEISLCrKA5PPyNwGxCQVaKuCigrQUgGOjwCMFAIT8QIEHCgAI6YECAEIOoIBMASqITDd6DaIAgAxiNNOUKQAgMt3oNYgCADKI0UxTpgCAyHSj1yAKAMggRjNNmQIAItONXoMoACCDGM00ZQoAiEw3eg2iAIAMYjTTlCkAIDLd6DWIAgAyiNFMU6YAgMh0o9cgCvwLFLgoMuGX1fsAAAAASUVORK5CYII=" />
            </div>
        </div>
    </transition>

    <transition name="slideleft">
        <div class="yota-bar-left" v-show="!this.bar_visible">
            <div class="yota-visible" @click="toggleVisible()">
                <img class="yota-invisible-img"
                    src="data:image/png;base64,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" />
            </div>
        </div>
    </transition>


    <dialog class="yota-login-back" ref="login" @click="loginModalClick($event)">
        <div class='yota-login'>
            <form class="yota-login-inner" @submit.prevent="login()">
                <div class="yota-login-close" @click="closeLogin()">
                    <img class="yota-login-close-img"
                        src="data:image/png;base64,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" />
                </div>
                <div class="yota-login-title">账号登录</div>
                <div class="yota-account"><input v-model="account" class="yota-account-input" placeholder="请输入账号" />
                </div>
                <div class="yota-password"> <input v-model="password" class="yota-password-input" type="password"
                        placeholder="请输入密码" /></div>
                <div class="yota-vcode"> <input v-model="vcode_r" ref="vcodeInput" class="yota-vcode-input"
                        placeholder="验证码（计算值）" />
                    <img class="yota-vcode-img" :src="this.vcode_img" @click="get_vcode()" />
                </div>
                <div class="yota-login-div">
                    <button class="yota-login-btn" type="submit">登录</button>
                </div>


                <div class="yota-other">
                    <div class="yota-register" @click="goToRegister()">去注册</div>
                    <div class="yota-charge" @click="goToCharge()">去发电获取权限</div>
                </div>
            </form>
        </div>
    </dialog>

    <dialog class="yota-question-back" ref="question" @click="questionModalClick($event)">
        <div class="yota-question-card">
            <div class="yota-question-info" v-html="questionMsg"></div>
            <div class="yota-question-icon">
                <div class="yota-question-img"></div>
            </div>
            <div class="yota-question-btns">
                <button class="yota-question-cancel-btn" @click="questionCancel()">取消</button>
                <button class="yota-question-confirm-btn" @click="questionConfirm()">确定</button>
            </div>
        </div>
    </dialog>

    <dialog class="yota-realdown-back" ref="realdown" @click="realdownModalClick($event)">
        <div class="yota-realdown-card">
            <div class="yota-realdown-close" @click="realdownClose()"></div>
            <div class="yota-realdown-info">{{ realdownMsg }}</div>
            <div class="yota-realdown-btns">
                <button class="yota-realdown-btn copy" @click="copyLink()">复制链接</button>
                <button class="yota-realdown-btn" @click="download1()">
                    在线下载1(适合电脑)
                </button>
                <button class="yota-realdown-btn" @click="download2()">
                    在线下载2(适合电脑)
                </button>
            </div>
        </div>
    </dialog>

    <dialog class="yota-loading" ref="loading">
        <div class="yota-container">
            <div class="yota-ball ball1"></div>
            <div class="yota-ball ball2"></div>
        </div>
        <div class="yota-loading-close" @click="closeLoading()">
            <img class="yota-loading-close-btn"
                src="data:image/png;base64,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" />
        </div>

    </dialog>



    <dialog class="yota-info-back" ref="info" @click="infoModalClick($event)">
        <div class="yota-info">
            <div class="yota-info-inner">
                <div class="yota-info-close" @click="closeInfo()">
                    <img class="yota-info-close-img"
                        src="data:image/png;base64,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" />
                </div>
                <div class="yota-user">
                    <div class="yota-user-avatar">
                        <img class="yota-user-avatar-img" :src="this.boy" />
                    </div>
                    <div class="yota-user-name">{{this.userInfo.nickname}}</div>
                    <button class="yota-user-logout" @click="logout()">退出登录</button>
                </div>
                <div class="yota-apps">
                    <div class="yota-app" v-for="app of this.apps_info">
                        <div class="yota-app-info">
                            <img class="yota-app-icon" :src="app.url" />
                            <div class="yota-app-name"> {{app.name}}</div>
                        </div>

                        <div class="yota-app-go">
                            <button class="yota-app-web" @click="goCharge(app)">去发电</button>
                            <button class="yota-app-charge" @click="goWebsite(app)">去网站</button>
                        </div>
                    </div>
                </div>

                <div class="yota-website" @click="goToCharge()">
                    vip.yotade.cc
                </div>
            </div>
        </div>
    </dialog>

    <dialog class="yota-player-back" ref="player" @click="playerClick($event)">
        <div class="yota-player-container">
            <video class="yota-player" ref="video" controls>
            </video>
            <button @click="closePlayer()">关闭</button>
        </div>
    </dialog>

    <dialog class=" yota-notice-back" ref="notice" @click="noticeClick($event)">
        <div class="yota-notice">
            <div class="yota-notice-card">
                <p class="yota-notice-tips" v-for=" p in this.notices">{{p}}</p>
                <div class="yota-notice-close" @click="closeNotice()">
                    <img
                        src="data:image/png;base64,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" />
                </div>
            </div>
        </div>
    </dialog>

    <dialog class="yota-toast" ref="toast">
        {{toastMsg}}
    </dialog>
</div>

          `,
        
                data() {
                    // 注意此处data声明的方式与脚手架一致
                    return {
                        timer: null,
                        has_notice: false,//是否有通知 有通知 橘色点可见
                        notices: [

                        ],//通知消息
                        toastMsg: "",
                        userInfo: {},
                        msg: "Message1",
                        avatar: "",
                        boy: "data:image/jpeg;base64,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ByOCKuPEr8jg1UZGQ4agC3HIJODw386krPq5HLv+VvvfzoAkooooAKKKKACiiigAooooAKKKKACiiigAqlKu1yPxFXagnGQG9OKAJdNm8i8Rj91jtP0PFdcQQcGuDrt4ZfPgjn/vqCfqOD+tNEskopaSmIKKKKACiiigBaKKKBBRRRTAKKKKQBRRRQAUUUUAFFFFAH//1IKKKKszCiiigAooooAKKKKACiikpALRRVe6uPstu03fov8AvGgZiavdeZL9mQ/LH1927/l0rOtofOk5+6vJqAkk5PJNbUMXkxhO/U/WpKJc0UVEZoxIIurH0oAkooooGFFFFABRRRQAUUUUAFFFFABRRRQAUUUxnUNt7mgB9KBmkqjd3AAMKf8AAj/SgCK5uPNPlx/dH6mrtvD5Kc/ePX29qr2cP/LZh/u/41eoAKWkooAKKKKACiiigAooooAKKKKACiiigAooooASilooASiiigAooooAWkoooAKKKWgAo4IIIyDwRRRQBj3EBhb1U9DUFbrosiFH6H9KxZI2jco3UUANVip3CrysHXcKoU+NyjZ7d6ALtORzG25fxHrTeCMjoaKAL4IYBl6Giq8DcmM9+RVigAooooAKKKKACiiigAooooAKKKKACiiigAooooAMAjaeh4qgQVJU9uKv1WnXDB/X+lAENFFFABRRRQAUUUUAOV2Q5U/h2q0kiydOD6VTooAvOiyDDdexqm6NGcN+dTJPjiT86nIVlweQaAKFFPeMxnnkdjTKACiiigAoIBGGGRRRQBVeEjlOR+tQ1oVG8QfkcGgBIpd/yt97+dS1QIKnB4Iq5HJ5g5+8OtAD6KKKACiiigAooooAKKKKACiiigAprjchHtmnUDrQBn10+jy77Voj1jbI+jf/AF65p12uV9DWpo8uy78s9JFI/EcigTOmpKKKokKKKKACiiigBaKSloEFFFFABRRRTAKKKKACiiikAUUUUAf/1YKKKKszCiiigAooooAKKKSkAtJRRQAtc1q9z5s/kKfli4+rd/8ACt26uPstu83ccL/vHp+XWuM5Y4HJNJlIt2cW9/MP3U/n2rUqJFEEYj9Ov1qpcXJA2J1PU0ih9zc7MxxH5u59PpUdlGdxmPbgfWqkcbSuEXvW0qhFCL0HAoAWiiigAooooAKKKKACiiigAooooAKKKjlk8sYH3jQA2WXb8q9e/tTYU/jP4VFHGXbnp3qxNMsCZ7n7ooAjuZ/KXYv32/QVSt4fOf5vujr/AIVCA80mByzGtpI1iQRr0HX3NADvYcCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACkpaKAEooooAKKKKAFooooAOtFQy7kPmp+NSI4kGRwe4oAdUFxB5yZX769Pf2qeloA5+krQvIMfvk6H7w9D61QoAswP/yzP4VPWfnHIq+jb1Dd+9AC5IIYdRzV/IYBh0NUKsQNwUPbkUAT0UUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFMlG6M+3NPoFAFCilI2kqexxSUAFFFFABRRRQAUUUUAFOR2jPy9PSm0UAXVdJRj8waryRlOR93+VRd8jg1YSf8AhlH40AV6KmkiwN8fzL7dqhoAKKKKACiiigBGVXGGqqVeJgw/OrdHBGD0oARWDruFLUYTY2U6HqKkoAKKKKACiiigAooooAKKKKACiiigCtcD5g3qKZDIYZUlHVGB/Kp5hmPPoaqCgDvDgnK9DyPxoqpYSebZRMeoG0/h/wDWq3VECUUUUAFFFFABS0lLQAUUUUCCiiigAooooAKKKKACiiigD//WgoooqzMKKKKACiiikAlFFFABRRTJJVhjaZ+iDP8AgKBmDrNxumW2B4jGT/vH/AVQtVAJmP8AD0+tV3d5ZC7csxyfqatMwhQD8hUlodNMVHP3j+lUOvJpSSxyepq7Zwbj5rj5R09zQBZtYfKj3N95v0FWaKKACkpaSgAooooAKKKKACiimk8hR1NADqQkAgdzQzBF3Gmou0GST7x/T2oAczBF3GqYDSv7nrSuzSvx+Aq0iCNefqTQAMyQR5PQfrWLJI0rl26mpbiczPxwo6D+tSWkHmN5jj5V/U+lAFq0h8tPMb7zdPYf/XqzSnmkoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACkpaKAEpaKKACiiigAwCMHoapENFJgdun0q7Ucqb146jpQA9GDruH40tUUcodw/EVeBDDcvQ0ALwQQeQeCKxp4TC+3qDyDWxUcsQmjKHr1H1oAxKmgfa209GqIgg4PBFJQBoUqsVIYdqYjb0Dd+hp1AF/gjI6GioYGyCh7cj6VNQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAVZxiTPqM1FVmcZQN6H+dVqACiiigAooooAKKKKACiiigAooooAVWZDlTg0E55pKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAEIypX1FUK0KpSLtcigDe0SXMcsJ7EOP5H+lbdcrpMnl3qA9HBQ/j0/WuppolhRRRTEFFFFABS0lLQAUUUUCCiiigAooooAKKKKACiiigD/14KKKKszCiiikAUlLSUDCiiigArD1m4+7aKenzP9ewrZllWCJp36IM/U9hXFu7SyGSQ5LHJpMaHxgIvmt/wEVCzFjk9aVmLHJ/AUscbSuETqaRRJBCZnx0A6mtkAABV4A4FMRFiQInT+Z9afQAUUUlABRRRQAUUUUAFFFFACEhQWPQUiKR8zfePX2HpRjc2ey9Pc0j5c+WP+BGgBF/etvP3R09/eoppNx2r0qSWQKNi8UyGP+NvwoAkij2jJ+8apXdxu/cx9B1PqasXc/lL5afebr7CsmgB8cbSuEXqa21VUUIvQVBaw+Um5vvN+gqxQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBVmTa24dG/nSRSbDg/dNWmUOpU96pEEEg9RQBfpKrwyf8s2/A1ZoAoXsOf3y/wDAv8azq6D2PIrHuYPJfj7p5H+FADIX2tg9Dwatnis+rsb7056jg0ASK2xg3pV/jt0rPq1A25Np6r/KgCWiiigAooooAKKKKACiiigAooooAKKKKACiiigBGG5GX1FURyK0Bwaosu12X0NADaKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKr3A5DeoxVio5hmM+3NAFWNzG6yL1Ugj8K7okN8y9GGR+PNcHXYWEnm2MTHqAVP4H/CmhMt0UUUyQooooAKWiigQUUUUAFFFLQAlLRRQAlFFFABRRRQB//QgoooqzMKKKKQCUUUUDCiioridbWFp27fdHqe1AGNrNzl1tEPCct9T/gKwqc7s7F3OSTkn3NCIzsFQZJqSgRGdgqDJNbMMKwJtHJPU0kEKwLgcsepqWgYtJRRQAUUUUAFFFFABRRRQAUUUUANJIwq9T0pCREme/8AM08DHJ6mqpJm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rOrbgTy4UXuRk/jQBJRRRQAUUUUAFFFFABRRRQAUUUUAFUb8/Ki/U1erMvjmUD0UUAUqs246t+FV6uxjbGPfmgB9FFFACj7w+tXqodx9a0D1oArDi5+tWKgfi4Q+tT0AFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABTJeI2p9RTnEePU0AQwjMg9uat1BAvBb14qegAooooAKKKKACiiigAooooAKKKKACiiigAqKc4jx/eOKmqpM259o6L/ADoAioopaAEoopaACkpTSUAFLSVHJJsGB1NADZZNvyr1pkcW75m6fzpYos/O9WKACiiigAooooAKKKUUAHSkpTSUAFFFFABRRRQAUUU13EYyevYUADuIxnuegqkSScnrQWLHc3WrMUePnbr2oAdFHsG5vvfyqdQNpkfhR1NCqNvmSHCDv6/Sqc87THA+VR0FADZpWlbJ4A6D0qGlpKAFp8bmORZB1Ugj8KjpaAO8JBO5eh5H40VVsn8yzif/AGdv/fPFWqozYlFFFAC0tJRQAUUUUAFFFFABRRRQAUUUlAC0UUUAFFFFABRRRQAUUUUAf//Sr0o6ikoHUVRBxd1/x8y/77fzqNzwq+gqW7/4+pf99v51XqSySFPMlVPU81uHk1nWKfM0h7DA/GtCgAooooAKKKKACiiigAooooAKKKKACse6Obh/Y4/KtkdRWDIdzs3qSaAGgZIA71onjj04qnAMyZ9BmrdABRRRQAh6Vo1nnpV5TlVPtQBDNw8be9SudpX3OKjuPuA+hp0x/dhvcUASUUhP7wofTIpaACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACilpKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKrXB5C1Zqsg8yYv2WgCwq7VC0tFFABRRRQAUUUUALSUUUALRSUUAFFFLQAlFFRyybPlX7x/SgBJZNnyL97+VVaXFFACUUuPWjNABRSUtACUUUtADWYIu41AiGQ+Y/SnsPMk2/wr1qX6UAFFFFABS0lFABS0lFABS9qBQaAEooooAKKKKACiimPKI+By38qAFkkEY9W9KpEljk8mgkk5PJNWoocfM3XsKAGxRY+Z/wF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UcnC8n2qZYHP3iF/U1aGAMLwPaigCJYYx1G761L2wOKKSgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAprMqDLnFNPmNwnyj1PX8KFhjU5PzH1NAERkkl4iU49aVbfHLn8BVmigBqqq8KMUtDMqjLHAqu05PEYx7mgCwzKoyxxVdpyeIxj3PWoCSTk8n3ooADycnk+pooooAKKKKACiiigAooooAKKKKACijtntULzAcJyfWgCUkKMscVXacnhOPeoSSxyTk04IcZbge9ADCc8mlCnqeKdlV+6M+5phJJyaAHZA6fnTck9aciM7BUBJPYVqwaYfvXBx/sr1/OgDLjjeVtkYLE9hWvBpij5rk5P90f1NaUcccS7IlCj2/xp9OxDYgCqoRQAo6AdKWiimIKKKKBBRTlRn6cD1qyqKnTr60DIViJ5f8AKp+gwKWigBCMgg96pVeqkep+tACUUUUwCiiigDH1Y/PGP9k/zrIrU1U/6Qo9EH8zWXUFrYKKKKBksH+uT/eH867luprh7f8A18f+8P513DfeNNEsbRRRTEFFFFABS0UUCCiiimAUUUUgEopaSgAooooAWiiigAooooAKKKKAP//Q88rYtf8Aj3T8f51j1rWbZg2/3T/OgCzRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBQuFzdD6A0VNMjNKGUZyuPyp6QgcvyfTtQBCqO/3Rx6mp1hReW+Y+/SpqSgBaSiigBaSiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAWmO6xj5uvpTJJQnC8t/Kq6q8hyOT60AIzNIct+A9KQAscKMn2qwsA/jOfYVOMAYHAoArrATy5x7Cp1RU+4Me/elooAWikooAWkpaSgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKWkZlUZY4qu05PCDHuaALDMqjLHFV2nPRBj3NQdTk8n3ooACSTknJ96KKKACiiigAoooxQAUUdOvFNLxjqwoAdRURmjHqaabj0X86AJ6UAmqhnkPTA+lMLu33iTQBdJVfvECoWnUfcGfrVdVLHCjJ9qn8lU5nbb7Dk0AQszyHnn2pxi2/wCtO326mnGfaNsI2D17n8agoAk3qv3Bj3PJqMkk5JzRUkIiLjziQv8As9aAGKrOdqgk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",
                        empty_img: "data:image/png;base64,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",
                        bar_visible: true,

                        account: "",
                        password: "",
                        vcode_sign: "",
                        vcode_img: "data:image/png;base64,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",
                        vcode_r: "",

                        apps_info: [],

                        entrance: "madou",
                        user_info_key: "",
                        apps_info_key: "",
                        version: "1.0.13",

                        //后端服务地址
                        server: "http://127.0.0.1:5000",
                        test_server: "http://127.0.0.1:5000",
                        prod_server: "https://api.yotade.cc",

                        //网站地址
                        website: "http://localhost:8080",
                        test_website: "http://localhost:8080",
                        prod_website: "https://vip.yotade.cc",
                        dev: false,

                        notice_toggle: false,//提醒框切换
                        other_info_key: "",//其他信息
                        play_state: 'init', // 播放按钮 右上角 init 初始状态 无点 parsing 正在解析中 白点  success 解析成功 绿点
                        video_code: "", // 解析获得的 视频video_code
                        last_video_id: "",//防止重复解析同一个视频

                        can_download: false,
                        last_download_url: null,

                        questionMsg: "",//提问提示
                        questionFunc: null,//提问回调
                        realdownMsg: "注：刷新或关闭当前页面会丢失链接，下载当前资源时会重新消耗次数",

                        isPhone: false,
                        player: null,
                        video_url: null,
                        last_video_url: null,//上次播放的视频地址

                        replacedPlayer: null,//替换播放器

                        inited: false,
                    };
                },

                mounted() {
                    this.beforeAction();

                    if (!this.checkLogin('login')) {
                        this.showLogin();
                    } else {
                        this.initFormData()
                    }
                },
                methods: {
                    beforeAction() {
                        this.avatar = this.empty_img; //初始头像为空

                        //获取当前环境 对应的 服务地址 
                        if (this.dev) {
                            this.server = this.test_server
                            this.website = this.test_website
                        } else {
                            this.server = this.prod_server
                            this.website = this.prod_website
                        }
                        //初始 用户信息存储key
                        this.user_info_key = `yota_user_${this.entrance}`;
                        this.apps_info_key = `yota_apps_${this.entrance}`;
                        this.other_info_key = `yota_other_${this.entrance}`;
                        // this.showInfo();

                        this.isPhone = this.isMobileEnvironment();

                        if (typeof Hls === "undefined") {
                            this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.8/hls.min.js')
                        }

                        // window.addEventListener('popstate', (event) => {
                        //     if (this.replacePlayer) {
                        //         this.replacePlayer.destroy();
                        //     }

                        // });


                    },

                    //加载脚本
                    loadScript(src) {
                        let script = document.createElement('script');
                        script.src = src;
                        script.onload = () => {
                        }
                        document.body.appendChild(script);

                    },



                    checkLogin(flag = 'no-login') {
                        let user_info = GM_getValue(this.user_info_key);
                        if (!user_info) {
                            //非第一次打开 检查登录信息 并提示 
                            if (flag !== 'login') {
                                this.showToast("请先登录");
                            }
                            return false;
                        }

                        //检查是否登录已过期
                        let expire_time = new Date(user_info.expire_time);
                        if (expire_time < new Date()) {
                            // GM_setValue(this.user_info_key, "");
                            this.avatar = this.empty_img;
                            if (flag !== 'login') {
                                this.showToast("登录信息已过期，请重新登录");
                            }
                            return false;
                        }
                        return true;

                    },

                    checkVIPValid(showTips = false) {
                        let user_info = GM_getValue(this.user_info_key);
                        if (!user_info) {
                            return false;
                        }
                        let valid = user_info.valid;
                        if (valid) {
                            //检查电量是否已过期
                            let vip_expire_time = user_info.vip_expire_time;
                            if (vip_expire_time) {
                                if (new Date(vip_expire_time) < new Date()) {
                                    this.logout();
                                    if (showTips) {
                                        this.showToast("当前账号电量已到期，请发电后使用");
                                    }
                                    return false;
                                }
                            } else {
                                return valid;
                            }

                        } else {

                            let headers = {
                                'Content-Type': 'application/json',
                                "Authorization": `Bearer ${this.userInfo.token}`
                            }
                            let data = {
                            }
                            this.reqByCROS(`${this.server}/checkvip`, 'POST', headers, JSON.stringify(data)).then((res) => {
                                if (res.code == 200) {
                                    let res_data = JSON.parse(res.data);
                                    if (res_data.code == 200) {
                                        this.logout();
                                        setTimeout(() => {
                                            this.showToast("请重新登录");
                                        }, 1000);
                                    } else {
                                        //用户在两个小时内没有发电
                                    }

                                    return
                                }
                                return
                            }).catch((e) => {
                                console.log(e)
                                return
                            }).finally(() => {
                            })
                            return valid;
                        }
                        return true;

                    },

                    //初始表单信息
                    initFormData(flag = 'no-login') {
                        let user_info = GM_getValue(this.user_info_key);
                        this.userInfo = user_info;
                        this.avatar = this.boy;//bar显示头像
                        this.has_notice = user_info.has_notice
                        this.notices = user_info.tips;


                        //获取插件列表
                        let apps_info = GM_getValue(this.apps_info_key);
                        for (let app of apps_info) {
                            app['url'] = `${this.website}/static/${app['icon']}`
                        }
                        this.apps_info = apps_info;

                        //检查版本并提示
                        if (flag === 'login') {
                            let apps_info = GM_getValue(this.apps_info_key);
                            let app = apps_info.find((item) => item.entrance === this.entrance);
                            if (app) {
                                let cur_version = this.version;
                                if (this.compareSemVer(app.version, cur_version) > 0) {
                                    this.showToast(`当前版本为${cur_version},请更新到${app.version}`)
                                }
                            }
                        }

                        //登录后调用该方法 且 有提示消息时 弹出提示
                        //因为登录后有网页刷新 所以只能用这种方式
                        if (flag === 'login') {
                            let other_info = {
                                notice: true,
                            }
                            GM_setValue(this.other_info_key, other_info)

                            //登录后自动弹出
                            let other = GM_getValue(this.other_info_key);
                            if (other) {
                                if (other.notice && this.has_notice) {
                                    this.showNotice();
                                }
                            }
                            let other_info2 = {
                                notice: false,
                            }
                            GM_setValue(this.other_info_key, other_info2)
                        }

                        if (!this.inited) {
                            //拦截用户请求
                            this.interceptHttpAndSetUser();
                            //屏蔽广告
                            this.blockAd();
                            this.inited = true;
                        }

                        //仅在登录后刷新页面
                        // if (flag === 'login') {
                        //     location.href = location.href;
                        // }

                        this.checkVIPValid(true)
                    },

                    blockAd() {
                        GM_addStyle(` /* 去广告 */
                                    html .van-overflow-hidden, body {
                                        overflow: auto !important;
                                    }

                                    .bg-page .main.blur {
                                        filter: blur(0px) !important;
                                    }
                                    .van-popup.van-popup--center.PayPop.absolutetop {
                                        display: none !important;
                                        z-index: -9999 !important;
                                        width: 0 !important;
                                    }
                                    .adList-pop-main,
                                    .PayPop,
                                    .vipMask,
                                    .app-list-pop,
                                    .play.md-play-popup,
                                    .md-mine-activity,
                                    .downApp,
                                    .van-overlay,
                                    .overAllList-wrap,
                                    .iosStore-btn,
                                    .noticeBar,
                                    .launchSwiperContent{
                                        display: none !important;
                                        z-index: -99999 !important;
                                        opacity: 0 !important;
                                        width: 0 !important;
                                    } `);
                    },

                    play() {
                        if (!this.checkLogin()) {
                            return;
                        }

                        if (!this.checkVIPValid(false)) {
                            this.showToast("当前账号没有权限，请发电后使用")
                            return
                        }

                        //和上次播放的视频地址相同时 仅播放视频
                        let src = this.video_url;
                        if (src && this.last_video_url == src) {
                            this.showPlayer();
                            this.$refs.video.play();
                            return
                        }
                        if (!src) {
                            this.showToast("未找到视频地址")
                            return
                        }
                        if (this.player) {
                            this.player.destroy();
                        }

                        this.showPlayer();
                        var hls = new Hls();
                        hls.loadSource(src);
                        hls.attachMedia(this.$refs.video);
                        hls.on(Hls.Events.MANIFEST_PARSED, function () {
                            this.$refs.video.play();
                        });
                        this.last_video_url = src;
                        this.player = hls;
                        return;

                        if (this.play_state === 'success') {
                            this.openTabAndPlay()
                            return
                        } else {
                            return
                        }
                        this.showToast("解析成功")
                        // this.openTabAndPlay()

                        let href = window.location.href
                        if (href.indexOf('/play/video') < 0) {
                            this.showToast("当前页面未找到视频");
                            return

                        }
                        href = this.getUrlWithoutParams(href);

                        if (this.isPhone) {
                            let j = href.lastIndexOf("/")
                            href = href.substring(0, j);
                        }

                        let i = href.lastIndexOf("/")
                        let video_id = href.substring(i + 1);
                        if (!video_id) {
                            this.showToast("当前页面未找到视频");
                            return
                        }

                        // 防止重复解析
                        if (this.last_video_id == video_id) {
                            this.openTabAndPlay()
                            return
                        }

                        let headers = {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${this.userInfo.token}`
                        }

                        let data = {
                            "video_id": video_id
                        }
                        this.loading()
                        this.showToast("正在解析中...")
                        this.play_state = 'parsing';
                        this.reqByCROS(`${this.server}/${this.entrance}/parsebyid`, 'POST', headers, JSON.stringify(data)).then((res) => {
                            if (res.code == 200) {
                                let res_data = JSON.parse(res.data);
                                if (res_data.code == 200) {
                                    this.video_code = res_data.data.video_code
                                    this.last_video_id = video_id
                                    this.showToast("解析成功")
                                    this.play_state = 'success';
                                    this.openTabAndPlay()
                                } else {
                                    this.showToast("解析失败")
                                    this.play_state = 'init';
                                }

                                return
                            }

                            if (res.code > 400 && res.code < 500) {
                                this.showToast("登录已过期,请重新登录")
                                this.play_state = 'init';
                                return
                            }

                            this.showToast("解析失败")
                            this.play_state = 'init';
                            return


                        }).catch((e) => {
                            this.showToast(`解析失败${e}`)
                            this.play_state = 'init';
                        }).finally(() => {
                            this.closeLoading();

                        })


                    },

                    async download() {
                        if (!this.checkLogin()) {
                            return;
                        }

                        if (!this.checkVIPValid(false)) {
                            this.showToast("当前账号没有权限，请发电后使用")
                            return
                        }

                        if (!this.can_download) {
                            this.showToast("当前页面未找到视频");
                            return
                        }

                        if (this.last_download_url == this.video_url) {
                            this.showRealdown();
                            return;
                        }
                        let headers = {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${this.userInfo.token}`
                        }
                        this.loading()
                        let res = await this.reqByCROS(`${this.server}/download/check`, 'POST', headers, "")
                        this.closeLoading();
                        if (res.code == 200) {
                            let checkInfo = JSON.parse(res.data).data;
                            this.dealCheck(checkInfo);
                        }



                    },

                    dealCheck(checkInfo) {
                        if (checkInfo.type === "success") {
                            this.question(checkInfo.tips, () => {
                                this.loading(); // 显示加载状态
                                let data = {
                                };
                                let headers = {
                                    'Content-Type': 'application/json',
                                    "Authorization": `Bearer ${this.userInfo.token}`
                                }
                                this.reqByCROS(`${this.server}/download/getvideo`, 'POST', headers, JSON.stringify(data))
                                    .then((res) => {
                                        if (res.code == 200) {
                                            // let downloadInfo = res.data;
                                            let data = JSON.parse(res.data).data;
                                            if (data.type == 'success') {
                                                this.last_download_url = this.video_url;
                                                this.showRealdown();
                                            } else {
                                                this.showToast(data.tips);
                                            }
                                        } else {
                                            this.showToast("服务器出错了，请联系管理员~");
                                        }
                                    })
                                    .catch((e) => {
                                        console.log(e);
                                        if (e.status >= 400 && e.status < 500) {
                                            this.showToast("登录信息已过期，请重新登录");
                                        } else {
                                            this.showToast("服务器出错了，请联系管理员~");
                                        }
                                    })
                                    .finally(() => {
                                        this.closeLoading();
                                    });
                            });
                        } else {
                            this.showToast(checkInfo.tips);
                        }
                    },

                    question(questionMsg, questionFunc) {
                        this.questionMsg = questionMsg;
                        this.questionFunc = questionFunc;
                        this.$refs.question.show();
                    },
                    questionCancel() {
                        this.questionFunc = null;
                        this.$refs.question.close();
                    },

                    questionConfirm() {
                        if (this.questionFunc) {
                            this.questionFunc();
                        }
                        this.$refs.question.close();
                        this.questionFunc = null;

                    },

                    showRealdown() {
                        this.$refs.realdown.show();
                    },

                    realdownClose() {
                        this.$refs.realdown.close();
                    },

                    copyLink() {
                        let url = this.getVideoUrl();
                        this.copyToClipboard(url);
                        this.showToast("已复制");
                        return;
                    },

                    download1() {
                        let url = this.getVideoUrl();
                        let downloadUrl = `https://tools.thatwind.com/tool/m3u8downloader#m3u8=${url}`;
                        window.open(downloadUrl, "_blank");

                    },
                    download2() {
                        let url = this.getVideoUrl();
                        let downloadUrl = `http://tools.bugscaner.com/m3u8.html?m3u8=${url}`;
                        window.open(downloadUrl, "_blank");
                    },

                    getVideoUrl() {
                        let url = `${this.video_url}`
                        return url;
                    },

                    copyToClipboard(text) {
                        const textarea = document.createElement("textarea");
                        textarea.value = text;
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textarea);
                    },



                    isMobileEnvironment() {
                        const userAgent = navigator.userAgent;
                        return /android|avantgo|blackberry|iemobile|ipad|iphone|ipod|opera mini|opera mobi|palm|pocket|psp|series(4|6)0|symbian|windows ce|windows phone|xda|xiino/i.test(userAgent)
                    },

                    getUrlWithoutParams(url) {
                        const urlObj = new URL(url);
                        urlObj.search = '';
                        return urlObj.toString();
                    },

                    //跳转到视频播放页
                    openTabAndPlay() {
                        let obj = {
                            "video_code": this.video_code,
                            "app_id": this.userInfo.app_id,
                            "entrance": this.entrance,
                            "token": this.userInfo.token
                        }
                        let queryStr = this.objectToQueryString(obj);
                        let copyOpen = window.open(`${this.website}/player${queryStr}`, "_blank");
                    },

                    objectToQueryString(obj) {
                        return (
                            "?" +
                            Object.keys(obj)
                                .map(
                                    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
                                )
                                .join("&")
                        );
                    },

                    //拦截用户请求  去广告 解析视频 
                    interceptHttpAndSetUser() {
                        // this.interceptXHR();
                        this.interceptFetch();
                    },

                    interceptFetch() {
                        let that = this;
                        const originalFetch = unsafeWindow.fetch;
                        unsafeWindow.fetch = function (url, options) {
                            // 添加你的自定义逻辑
                            console.log('Intercepted request to:', url);
                            let requestUrl = '';
                            if (url.endsWith("/media/play") || url.endsWith("/user/info") || url.endsWith("/login/guest")) {
                                // if (url.endsWith("/media/play")) {
                                requestUrl = url;
                            }
                            // 调用原始的fetch方法
                            return originalFetch(url, options).then(async (response) => {

                                if (requestUrl) {
                                    let result = await response.clone().json();
                                    if (requestUrl.endsWith("/user/info") || requestUrl.endsWith("/login/guest")) {
                                        let newResponse = await that.parseVipUser(requestUrl, result);
                                        return new Response(JSON.stringify(newResponse), {
                                            status: response.status,
                                            statusText: response.statusText,
                                            headers: response.headers
                                        })
                                        // return newResponse;
                                    } else {
                                        that.parse(requestUrl, result);
                                        return response;
                                    }
                                    // const handler = {
                                    //     get(target, prop, receiver) {
                                    //         if (prop === 'json') {
                                    //             return () => target.json().then(data => { /* 在
                                    //                     这里修改data */
                                    //                 try {
                                    //                     that.parse(data);
                                    //                 } catch (e) {
                                    //                     console.log(e)
                                    //                 }
                                    //                 return data;
                                    //             });
                                    //         } else if (prop === 'text') {
                                    //             return () => target.text().then(text => text.toUpperCase()); // 例如，转换为大写
                                    //         } else if (prop === 'arrayBuffer') {
                                    //             // 可以添加对arrayBuffer的处理逻辑
                                    //         }
                                    //         return Reflect.get(...arguments); // 默认行为
                                    //     }
                                    // };
                                    // return new Proxy(response, handler); // 创建代理对象拦截响应体读取操作

                                }

                                // 返回原始的响应
                                return response;
                            });
                        };
                    },

                    async parseVipUser(requestUrl, res) {
                        if (res.code == 200 && res.msg == "success") {
                            // this.play_state = 'parsing' //播放绿点隐藏

                            if (!this.checkLogin('login')) {
                                // this.play_state = 'init';
                                return;
                            }
                            //没有权限时 直接返回
                            if (!this.checkVIPValid(false)) {
                                // this.play_state = 'init';
                                return
                            }


                            let headers = {
                                'Content-Type': 'application/json',
                                "Authorization": `Bearer ${this.userInfo.token}`
                            }

                            let data = {
                                "data": {
                                    "response_data": res,
                                    "requestUrl": requestUrl
                                }
                            }

                            // this.showToast("正在解析")

                            let res2 = await this.reqByCROS(`${this.server}/${this.entrance}/parsevipuser`, 'POST', headers, JSON.stringify(data))
                            if (res2.code == 200) {
                                let res_data = JSON.parse(res2.data);
                                if (res_data.code == 200) {
                                    let newResponse = res_data['data']['response']
                                    // this.showToast("解析成功")

                                    return newResponse
                                } else {
                                    // this.showToast("解析失败")
                                }

                                if (res2.code >= 400 && res2.code < 500) {
                                    // this.showToast("登录已过期请重新登录")
                                    return
                                }
                            }
                        }
                    },

                    parse(requestUrl, res) {
                        if (res.code == 200 && res.msg == "success") {
                            this.play_state = 'parsing' //播放绿点隐藏

                            if (!this.checkLogin('login')) {
                                this.play_state = 'init';
                                return;
                            }
                            //没有权限时 直接返回
                            if (!this.checkVIPValid(false)) {
                                this.play_state = 'init';
                                return
                            }


                            let headers = {
                                'Content-Type': 'application/json',
                                "Authorization": `Bearer ${this.userInfo.token}`
                            }

                            let data = {
                                "data": {
                                    "response_data": res,
                                    "requestUrl": requestUrl
                                }
                            }

                            this.showToast("正在解析")

                            this.reqByCROS(`${this.server}/${this.entrance}/parse`, 'POST', headers, JSON.stringify(data)).then((res) => {
                                if (res.code == 200) {
                                    let res_data = JSON.parse(res.data);
                                    if (res_data.code == 200) {
                                        this.video_url = res_data['data']['video_info']['video_url'];

                                        let useTopPlayer = res_data['data']['video_info']['useTopPlayer'];
                                        this.can_download = true;
                                        this.play_state = 'success';
                                        if (useTopPlayer) {
                                            this.replacePlayer();
                                        }
                                        this.showToast("解析成功")
                                        return
                                    } else {
                                        this.showToast("解析失败")
                                    }

                                    if (res.code >= 400 && res.code < 500) {
                                        this.showToast("登录已过期请重新登录")
                                        this.play_state = 'init';
                                        return
                                    }
                                    this.play_state = 'init';
                                }

                            }).catch((e) => {
                                this.showToast("解析失败")
                                this.play_state = 'init';
                            })
                        }
                    },

                    replacePlayer() {
                        this.findElement('.md-video-play').then((el) => {
                            el.innerHTML = `<div id="yota-replacedplayer"></div>`

                            if (this.replacedPlayer) {
                                this.replacedPlayer.destroy();
                            }
                            let PlayerComp = Vue.extend({
                                template: `<div id="yota-replacedplayer-inner">
                                              <video class="yota-replacedplayer-video" controls ref="player"></video>
                                          </div>`,

                                data() {
                                    return {
                                        topPlayer: null,
                                        intervalId: null
                                    }
                                },
                                mounted() {

                                    GM_addStyle(`
                                        #yota-replacedplayer-inner {
                                            width: 100%;
                                            height: 100%;
                                        }
                                        .yota-replacedplayer-video{
                                            width: 100%;
                                            height: 100%;
                                        }
                                    `)

                                },


                                methods: {
                                    play(src) {
                                        var hls = new Hls();
                                        hls.loadSource(src);
                                        hls.attachMedia(this.$refs.player);
                                        hls.on(Hls.Events.MANIFEST_PARSED, () => {
                                            this.$refs.player.play();
                                        });
                                        this.topPlayer = hls;

                                        // 确保返回主页时 防止 播放器已不可见但视频仍在播放的问题
                                        this.intervalId = setInterval(() => {
                                            let el = document.querySelector(".yota-replacedplayer-video")
                                            if (!el) {
                                                this.destroy();
                                            }
                                        }, 1000)
                                    },
                                    destroy() {
                                        this.$refs.player.pause();
                                        this.topPlayer.destroy();
                                        if (this.intervalId) {
                                            clearInterval(this.intervalId);
                                        }

                                    },
                                }
                            })

                            let replacedPlayer = new PlayerComp();
                            this.replacedPlayer = replacedPlayer;

                            this.replacedPlayer.$mount('#yota-replacedplayer');
                            this.replacedPlayer.play(this.video_url);
                        })

                    },

                    interceptXHR() {
                        let that = this;
                        const originOpen = XMLHttpRequest.prototype.open;
                        XMLHttpRequest.prototype.open = function (method, url) {
                            if (url.endsWith("/media/play")) {
                                this.requestUrl = url;
                            }
                            // that.interceptXHROpen(this, url);
                            return originOpen.call(this, method, url);
                        };
                        const originSend = XMLHttpRequest.prototype.send;
                        XMLHttpRequest.prototype.send = async function (...args) {
                            if (this.requestUrl) {
                                // await that.interceptXHRSend(this, this.url, args);
                                that.interceptXHRSend2(this, this.requestUrl, args);
                            }

                            return originSend.call(this, ...args);
                        };
                    },

                    interceptXHROpen(that, url) {
                        if (url.endsWith("/movie/detail")) {
                            const xhr = that;
                            const getter = Object.getOwnPropertyDescriptor(
                                XMLHttpRequest.prototype,
                                "response"
                            ).get;
                            Object.defineProperty(xhr, "responseText", {
                                get: () => {
                                    let result = getter.call(xhr);
                                    try {
                                        let res = JSON.parse(result, `utf-8`);
                                        if (res.code == 200 && res.msg == "success") {
                                            this.play_state = 'parsing' //播放绿点隐藏

                                            let headers = {
                                                'Content-Type': 'application/json',
                                                "Authorization": `Bearer ${this.userInfo.token}`
                                            }

                                            let data = {
                                                "data": {
                                                    "video_info": res.data
                                                }
                                            }

                                            this.showToast("正在解析")

                                            this.reqByCROS(`${this.server}/${this.entrance}/parsebyid`, 'POST', headers, data).then((res) => {
                                                if (res.code == 200) {
                                                    this.play_state = 'success';
                                                    let res_data = res.data;

                                                    return
                                                }

                                                if (res.code >= 400 && res.code < 500) {
                                                    this.showToast("登录已过期请重新登录")
                                                    return
                                                }


                                            }).catch((e) => {
                                                this.showToast("解析失败")
                                            })
                                        }
                                        return JSON.stringify(res, `utf-8`);
                                    } catch (e) {
                                        console.log("发生异常! 解析失败!");
                                        console.log(e);
                                        return result;
                                    }

                                    return res;
                                },
                            });
                        }
                    },

                    async interceptXHRSend(that, url, params) {
                        if (url.endsWith("/movie/detail")) {

                            if (!this.checkLogin('login')) {
                                return;
                            }


                            let headers = {
                                'Content-Type': 'application/json',
                                "Authorization": `Bearer ${this.userInfo.token}`
                            }

                            let data = {
                                "video_id": params[0]
                            }

                            this.showToast("正在解析")
                            this.play_state = 'parsing' //播放绿点隐藏

                            try {

                                let res = await this.reqByCROS(`${this.server}/${this.entrance}/parsebyid`, 'POST', headers, JSON.stringify(data))
                                if (res.code == 200) {
                                    let res_data = JSON.parse(res.data);
                                    if (res_data.code == 200) {
                                        this.video_code = res_data.data.video_code;
                                        this.showToast("解析成功")
                                        this.play_state = 'success';
                                        // this.openTabAndPlay()
                                    } else {
                                        this.showToast("解析失败")
                                        this.play_state = 'init';
                                    }

                                    return
                                } else {
                                    this.showToast("解析失败");
                                    this.play_state = 'init';
                                }
                            } catch (e) {
                                this.showToast("解析失败")
                                this.play_state = 'init';
                            }

                            // this.reqByCROS(`${this.server}/${this.entrance}/parsebyid`, 'POST', headers, JSON.stringify(data)).then((res) => {
                            //     if (res.code == 200) {
                            //         let res_data = JSON.parse(res.data);
                            //         if (res_data.code == 200) {
                            //             this.video_code = res_data.data.video_code
                            //             this.play_state = true;
                            //             this.showToast("解析成功")
                            //             // this.openTabAndPlay()
                            //         } else {
                            //             this.showToast("解析失败")
                            //         }

                            //         return
                            //     }

                            //     if (res.code > 400 && res.code < 500) {
                            //         this.showToast("登录已过期,请重新登录")
                            //         return
                            //     }

                            //     this.showToast("解析失败")
                            //     return


                            // }).catch((e) => {
                            //     this.showToast("解析失败")
                            // })
                        }
                    },

                    async interceptXHRSend2(that, url, params) {
                        if (url.endsWith("/media/play")) {


                            const xhr = that;
                            const getter = Object.getOwnPropertyDescriptor(
                                XMLHttpRequest.prototype,
                                "response"
                            ).get;
                            Object.defineProperty(xhr, "responseText", {
                                get: () => {
                                    let result = getter.call(xhr);
                                    try {
                                        let res = JSON.parse(result, `utf-8`);
                                        if (res.code == 200 && res.msg == "success") {
                                            this.play_state = 'parsing' //播放绿点隐藏

                                            if (!this.checkLogin('login')) {
                                                this.play_state = 'init';
                                                return;
                                            }
                                            //没有权限时 直接返回
                                            if (!this.checkVIPValid(false)) {
                                                this.play_state = 'init';
                                                return
                                            }


                                            let headers = {
                                                'Content-Type': 'application/json',
                                                "Authorization": `Bearer ${this.userInfo.token}`
                                            }

                                            let data = {
                                                "data": {
                                                    "response_data": res
                                                }
                                            }

                                            this.showToast("正在解析")

                                            this.reqByCROS(`${this.server}/${this.entrance}/parse`, 'POST', headers, data).then((res) => {
                                                if (res.code == 200) {
                                                    let res_data = res.data;
                                                    this.video_url = res_data['video_info']['video_url'];
                                                    this.can_download = true;
                                                    this.play_state = 'success';
                                                    return
                                                }

                                                if (res.code >= 400 && res.code < 500) {
                                                    this.showToast("登录已过期请重新登录")
                                                    this.play_state = 'init';
                                                    return
                                                }
                                                this.play_state = 'init';

                                            }).catch((e) => {
                                                this.showToast("解析失败")
                                                this.play_state = 'init';
                                            })
                                        }
                                        return JSON.stringify(res, `utf-8`);
                                    } catch (e) {
                                        console.log("发生异常! 解析失败!");
                                        console.log(e);
                                        this.play_state = 'init';
                                        return result;
                                    }

                                    return res;
                                },
                            });
                        }

                    },

                    avatarClick() {
                        //点击头像 未登录或登录已过期 打开登录窗口  否则打开应用列表
                        if (!this.checkLogin('login')) {
                            this.showLogin();
                        } else {
                            this.showInfo();
                        }
                    },

                    //去注册
                    goToRegister() {
                        let url = `${this.website}/register`
                        window.open(url, "_blank");
                    },

                    //去为本插件发电
                    goToCharge() {
                        let url = `${this.website}`
                        window.open(url, "_blank");
                    },

                    // 应用列表充电
                    goCharge(app) {

                        let url = `${this.website}/detail?app_id=${app.id}`
                        window.open(url, "_blank");
                    },


                    //应用列表 去网站
                    goWebsite(app) {
                        let url = `${app.website_url}`
                        window.open(url, "_blank");
                    },




                    //展示登录框
                    showLogin() {
                        this.get_vcode();

                        //自动填写账号密码
                        let user_info = GM_getValue(this.user_info_key);
                        if (user_info) {
                            this.account = user_info.account
                            this.password = user_info.password
                        }
                        this.$refs.login.show();
                        if (this.account && this.password) {
                            this.$refs.vcodeInput.focus();
                        }
                    },

                    //获取验证码
                    get_vcode() {
                        this.reqByCROS(`${this.server}/vcode`, "POST", {}, {}).then((res) => {
                            console.log(res)
                            if (res.code === 200) {
                                let data = JSON.parse(res.data)
                                this.vcode_img = `data:image/png;base64,${data.img}`;
                                this.vcode_sign = data.vcode_sign
                            }
                        })
                    },
                    //关闭登录框
                    closeLogin() {
                        this.$refs.login.close();
                    },

                    //关闭登录模态框
                    loginModalClick(e) {
                        let target = e.target;
                        if (target.classList.contains("yota-login-back")) {
                            this.closeLogin();
                        }
                    },



                    showInfo() {
                        this.$refs.info.show();
                    },
                    closeInfo() {
                        this.$refs.info.close();
                    },
                    //信息模态框关闭
                    infoModalClick(e) {
                        let target = e.target;
                        if (target.classList.contains("yota-info-back")) {
                            this.closeInfo();
                        }
                    },



                    login() {

                        if (!/^.{6,8}$/.test(this.password)) {
                            this.showToast("密码不符合规则");
                            return;
                        }

                        this.loading();
                        let post_data = {
                            "account": this.account,
                            "password": this.password,
                            "vcode_sign": this.vcode_sign,
                            "vcode": this.vcode_r,
                            "entrance": this.entrance
                        }
                        let headers = {
                            'Content-Type': 'application/json'
                        }
                        this.reqByCROS(`${this.server}/login`, "POST", headers, JSON.stringify(post_data)).then((res) => {
                            console.log(res)
                            this.closeLoading();
                            if (res.code === 200) {
                                let data = JSON.parse(res.data)
                                if (data.code === 200) {
                                    this.closeLogin();//关闭登录框
                                    let user_info = data.data.more.user_info;
                                    let apps_info = data.data.more.apps_info;
                                    GM_setValue(this.user_info_key, user_info);
                                    GM_setValue(this.apps_info_key, apps_info);
                                    this.initFormData('login')

                                } else {
                                    this.showToast(data.msg)
                                    this.vcode_sign = data.data.vcode_sign;
                                    this.vcode_img = `data:image/png;base64,${data.data.img}`;
                                }
                            }
                        })


                    },

                    logout() {
                        //退出登录 删除用户信息 应用列表
                        GM_deleteValue(this.user_info_key);
                        GM_deleteValue(this.apps_info_key);

                        this.userInfo = {

                        }
                        //头像置空
                        this.avatar = this.empty_img;

                        //关闭 应用列表弹窗
                        this.closeInfo();
                    },

                    vcode() {


                    },


                    //显示加载动画
                    loading() {
                        this.$refs.loading.show();
                    },

                    //关闭加载动画
                    closeLoading() {
                        this.$refs.loading.close();
                    },


                    //弹出提示
                    showToast(toastMsg) {
                        this.toastMsg = toastMsg;
                        if (!this.timer) { //dialog重复showModal会报错
                            this.$refs.toast.show();
                        }
                        if (this.timer) {
                            clearTimeout(this.timer);
                            this.timer = null;
                        }
                        this.timer = setTimeout(() => {
                            this.$refs.toast.close();
                            this.timer = null;

                        }, 3000)
                    },



                    //查看消息
                    viewNotice() {
                        if (!this.has_notice) {
                            this.showToast("没有需要查看的消息～");
                            return;
                        }
                        if (this.notice_toggle) {
                            this.closeNotice();
                        } else {
                            this.showNotice();
                        }

                    },

                    noticeClick(e) {
                        // console.log(e.target);
                        let target = e.target;
                        if (target.classList.contains("yota-notice")) {
                            this.closeNotice();
                        }
                    },



                    //展示消息框
                    showNotice() {
                        this.$refs.notice.show();
                        this.notice_toggle = true;
                    },
                    //关闭消息框
                    closeNotice() {
                        this.$refs.notice.close();
                        this.notice_toggle = false;
                    },

                    toggleVisible() {
                        this.bar_visible = !this.bar_visible;
                    },

                    //展示播放器
                    showPlayer() {
                        this.$refs.player.show();
                    },
                    //关闭播放器
                    closePlayer() {
                        this.$refs.video.pause();
                        this.$refs.player.close();
                    },


                    // 跨域请求
                    reqByCROS(url, req_type, headers, data) {
                        console.log("请求开始");
                        var p = new Promise((resolve, reject) => {
                            // fetch(url, {
                            //     method: req_type,
                            //     headers: headers,
                            //     body: data
                            // }).then(response => response.json())
                            //     .then(data => {

                            //         let text = JSON.stringify(data);
                            //         let resp = {}
                            //         resp.code = 200
                            //         resp.data = text
                            //         resolve(resp);

                            //     })
                            //     .catch(error => {
                            //         let resp = {}
                            //         resp.code = 500
                            //         reject(resp);
                            //         console.error('Error:', error); // 捕获和处理异常
                            //     });

                            var request = new XMLHttpRequest();
                            request.open(req_type, url, true);
                            for (let key in headers) {
                                request.setRequestHeader(key, headers[key]);
                            }
                            request.timeout = 10000;
                            request.onload = function () {
                                if (request.readyState == 4) {
                                    if (request.status === 200) {

                                        let text = request.responseText;
                                        let resp = {}
                                        resp.code = request.status
                                        resp.data = text
                                        resolve(resp);

                                    } else {
                                        let resp = {}
                                        resp.code = 500
                                        reject(resp);
                                    }
                                }
                            };
                            request.onerror = function () {
                                let resp = {}
                                resp.code = 500
                                reject(resp);
                            };
                            request.ontimeout = function () {
                                let resp = {}
                                resp.code = 500
                                reject(resp);
                            };
                            request.send(data);


                            //不能使用以下方式请求 糖心 会检测到 可能会重复刷新界面
                            // GM_xmlhttpRequest({
                            //     method: req_type,
                            //     url: url,
                            //     headers: headers,
                            //     data: data,
                            //     timeout: 50000, // 设置超时时间为5000毫秒
                            //     ontimeout: function (e) {
                            //         let resp = {}
                            //         resp.code = 500
                            //         reject(resp);
                            //     },
                            //     onload: function (response) {
                            //         console.log("响应成功");
                            //         let text = response.responseText;

                            //         let resp = {}
                            //         resp.code = response.status
                            //         resp.data = text
                            //         resolve(resp);
                            //     },
                            //     onerror: function (response) {
                            //         let resp = {}
                            //         resp.code = 500
                            //         reject(resp);
                            //     },
                            // });
                        });
                        return p;
                    },

                    compareSemVer(version1, version2) {
                        const [major1, minor1, patch1] = version1.split('.').map(Number);
                        const [major2, minor2, patch2] = version2.split('.').map(Number);
                        if (major1 > major2) return 1;
                        if (major1 < major2) return -1;
                        if (minor1 > minor2) return 1;
                        if (minor1 < minor2) return -1;
                        if (patch1 > patch2) return 1;
                        if (patch1 < patch2) return -1;
                        return 0; // 两个版本号相等
                    },

                    findElement(selector, retry = 10) {
                        let start = null;
                        let n = 0;
                        return new Promise((resolve, reject) => {
                            function find(timestamp) {
                                if (!start) {
                                    start = timestamp;
                                }
                                if (n < retry) {
                                    let interval = timestamp - start;
                                    if (interval > 500) {
                                        start = timestamp;
                                        let el = document.querySelector(selector); if (el) {
                                            resolve(el);
                                        } else {
                                            n++;
                                            requestAnimationFrame(find);
                                        }
                                    } else {
                                        requestAnimationFrame(find);
                                    }
                                } else {
                                    reject("NO-ELEMENT");
                                }
                            }
                            requestAnimationFrame(find);
                        })
                    }
                },
                
      },
    },
  });
}

if (!window.Vue) {
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/vue/2.1.8/vue.min.js";
  script.onload = function () {
    startScript();
  };
  script.onerror = function (e) {
    alert("vue初始化失败");
  };
  document.head.appendChild(script);
} else {
  startScript();
}
