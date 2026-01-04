// ==UserScript==
// @name css样式
// @namespace franciszhao
// @version 1.0.0
// @description 一款使用 Adobe 品牌字体替换网页原有字体的用户样式表，为你呈现更统一美观的页面风格。
// @license 1
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/447013/css%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/447013/css%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
let css = `body,
div,
dl,
dt,
dd,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
h6,
pre,
code,
form,
fieldset,
legend,
input,
button,
textarea,
p,
blockquote,
th,
td,
img {
    margin: 0;
    padding: 0
}

body {
    background: #fff;
    color: #555;
    font-size: 14px;
    font-family: "microsoft yahei", Simsun, Tahoma
}

td,
th,
caption {
    font-size: 14px
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-weight: normal;
    font-size: 100%
}

address,
caption,
cite,
code,
dfn,
em,
strong,
th,
var {
    font-style: normal;
    font-weight: normal
}

a {
    color: #000;
    text-decoration: none
}

a:hover {
    text-decoration: none
}

img {
    border: 0
}

ol,
ul,
li {
    list-style: none
}

input,
textarea,
select,
button {
    font-size: 14px
}

table {
    border-collapse: collapse
}

html {
    overflow-y: scroll
}

.header {
    height: 50px;
    width: 100%;
    background: #f1f1f1;
    box-shadow: 0 2px 5px #b0b0b0;
    position: relative
}

#container {
    width: 960px;
    margin: 0 auto;
    margin-top: 350px
}

.cate {
    width: 100%;
    background: #fff;
    margin-bottom: 10px;
    border-radius: 6px;
    overflow: hidden
}

.cate_name {
    height: 40px;
    width: 100%;
    background: #2cbafc;
    overflow: hidden
}

.cate .pink {
    background: #fd6ea3
}

.cate .red {
    background: #c52622
}

.cate .green {
    background: #23be9b
}

.cate .yellow {
    background: #fcc800
}

.cate .gray {
    background: #788daa
}

.cate .orange {
    background: #f76e25
}

.cate .black {
    background: #333
}

.cate_name p {
    font-size: 20px;
    font-weight: bold;
    line-height: 40px;
    color: white;
    margin-left: 20px
}

.cate li {
    float: left;
    text-align: center;
    display: block;
    width: 119px;
    height: 40px;
    line-height: 40px;
    border-right: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
    font-size: 14px;
    transition: color .5s, background-color .5s;
    overflow: hidden
}

.cate li:hover {
    color: #fff;
    background: #333
}

.cate li b {
    width: 16px;
    height: 16px;
    font-weight: normal;
    background: #2cbafc;
    color: #fff;
    padding: 1px 3px;
    margin-left: 4px;
    font-size: 14px;
    border-radius: 2px
}

.clear {
    clear: both;
    height: 0
}

.side {
    position: fixed;
    bottom: 45px;
    left: 50%;
    width: 70px;
    height: 130px;
    margin-left: 497px
}

.side_div {
    width: 95px;
    height: 32px;
    background: #fff;
    margin-top: 5px
}

#topp {
    background: url(../img/top.jpg)
}

#guestbook {
    text-align: center;
    line-height: 32px;
    transition: background-color .3s
}

#guestbook:hover {
    background: #dfdfdf
}

@media screen and (max-width: 1200px) {
    .side {
        display: none
    }
}

@media screen and (max-width: 960px) {
    #container {
        width: 98%;
        margin-top: 40%
    }

    .cate li {
        width: 20%;
        margin-right: -1px;
        height: 35px;
        line-height: 35px
    }

    .cate_name {
        height: 35px
    }

    .cate_name p {
        font-size: 21px;
        line-height: 35px
    }
}

@media screen and (max-width: 800px) {
    .cate li {
        font-size: 15px;
        height: 30px;
        line-height: 30px
    }

    .cate_name {
        height: 30px
    }

    .cate_name p {
        font-size: 20px;
        line-height: 30px
    }
}

@media screen and (max-width: 640px) {
    .cate li {
        width: 25%;
        font-size: 13px;
        height: 30px;
        line-height: 30px
    }

    .cate_name {
        height: 30px
    }

    .cate_name p {
        font-size: 17px;
        line-height: 30px
    }

    .cate li b {
        width: 16px;
        height: 16px;
        font-weight: normal;
        background: #2cbafc;
        color: #fff;
        padding: 2px 3px;
        margin-left: 4px;
        font-size: 10px;
        border-radius: 2px
    }
}

.ad img {
    width: 100%;
    margin-bottom: -3px;
    transition: opacity .5s
}

.ad img:hover {
    opacity: .7
}

#container .footer {
    border-radius: 10px 10px 0 0;
    height: 80px;
    margin-bottom: 0;
    opacity: .7
}

.footer p {
    text-align: center;
    line-height: 40px;
    color: #333
}

.footer p a {
    color: #333
}

.nav {
    width: 100%;
    margin-bottom: 10px;
    overflow: hidden
}

.nav li {
    float: left;
    text-align: center;
    display: block;
    width: 118px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #ca5c5c;
    background: #e47653;
    border-radius: 5px;
    font-size: 15px;
    transition: color .5s, background-color .5s;
    overflow: hidden
}

.nav li:hover {
    color: #fff;
    background: #333
}

.banner img {
    width: 100%;
    transition: opacity .5s;
    border-radius: 5px
}

.banner img:hover {
    opacity: .9
}

.app {
    box-shadow: 0 0 15px rgba(100, 100, 100, .1);
    overflow: hidden;
    border-radius: 5px;
    background-color: #fff
}

.navi {
    font-size: 0;
    padding: 1px;
    text-align: center
}

.appico {
    width: calc(10% - 3px);
    margin: 7px 1px 7px 1px;
    height: auto;
    box-sizing: border-box;
    display: inline-block;
    position: relative
}

.appico p {
    width: 100%;
    height: 25px;
    line-height: 25px;
    text-align: center;
    font-size: 13px;
    margin: 0;
    color: #000;
    overflow: hidden
}

.naicon {
    border-radius: 10px;
    overflow: hidden;
    font-size: 0;
    margin: 2px 13px 2px 13px;
}

.appico img {
    width: 100%
}

.appico:hover .btn-raised {
    -webkit-box-shadow: 0 0 12px 4px rgba(0, 0, 0, .24), 0 0 2px -2px rgba(0, 0, 0, .4), 0 1px 12px 0 rgba(0, 0, 0, .22);
    box-shadow: 0 0 12px 4px rgba(0, 0, 0, .24), 0 0 2px -2px rgba(0, 0, 0, .4), 0 1px 12px 0 rgba(0, 0, 0, .22)
}

@media screen and (max-width: 1200px) {
    .side {
        display: none
    }

    .faq {
        display: none
    }

    .xm {
        display: none
    }
}

@media screen and (max-width: 960px) {
    body {
        background-size: 150%
    }

    #container {
        width: 98%;
        margin-top: 40%
    }

    .nav li {
        width: 25%;
        margin-right: -2px;
        height: 30px;
        font-size: 11px;
        line-height: 30px
    }

    .toptips li {
        width: 100%;
        margin-right: -2px;
        height: 35px;
        line-height: 35px
    }

    .good li {
        width: 25%;
        height: 35px;
        line-height: 35px
    }

    .cate li {
        width: 25%;
        margin-right: -1px;
        height: 35px;
        line-height: 35px
    }

    .cate_name {
        height: 35px
    }

    .cate_name p {
        font-size: 18px;
        line-height: 35px
    }

    .appico {
        width: calc(20% - 3px)
    }`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
