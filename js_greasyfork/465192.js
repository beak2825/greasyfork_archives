// ==UserScript==
// @name        Unpaglifying Pagla
// @description Unpaglas the pagla
// @namespace   Violentmonkey Scripts
// @match       https://www.chd4.com/*
// @match       https://www.crazyhd.com/*
// @run-at      document-end
// @version     1.0
// @grant       GM_addStyle
// @license		  MIT
// @downloadURL https://update.greasyfork.org/scripts/465192/Unpaglifying%20Pagla.user.js
// @updateURL https://update.greasyfork.org/scripts/465192/Unpaglifying%20Pagla.meta.js
// ==/UserScript==

const css = `
#main{
      display: flex;
    flex-direction: column;
    float: right;
    margin-top: -24px;
}
#main-left br{
  display: none;
}
#main-left .panel{
  margin-bottom: 30px;
}
td.listb{
  padding: 4px;
  border-bottom: 1px solid #444;
}
td.lista{
  background-color: #333;
}
td.listb b a::after{
  content: "\\a";
  white-space: pre;
}
td.listb, td.listb > a span{
  font-size: 1.2rem;
}
td.listb > b{
  font-size: 1.4rem;
}
.chatoutput{
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
  margin-bottom: 10px;
  font-weight: 500;
  color: #FFF;
  background-color: #333;
}
.btn-download, .btn-bookmark{
  width: 100%;
}
.quote{
  color: #fff;
  background-color: #333;
  border-style: none;
  font-size: 12px;
}
.quote td{
  border: 1px dotted #000;
  padding: 10px;
}
.panel-body .btn ~ br{
  display: none;
}
.panel-body table td.header a[name="top"]{
  font-size: 2rem;
}
.img-thumbnail{
    background-color: transparent;
    border: 0px;
}
.sliceslider{
  width: 95.8%;
}
#top-nav, #logo, .sliceslider, .chd-cat-nav, .panel-default{
  background-color: #444;
  border: 1px solid #505050;
}
#smartkey::placeholder{
  color: green;
  font-weight: 600;
  font-size: 13px;
}
.list_carousel a img{
  transition-duration: 0.3s;
}
.list_carousel a:hover{
  box-shadow: none;
}
.list_carousel a:hover img{
  transform: scale(1.1);
}
i.fa-search{
  font-size: 24px;
  line-height: 0.2;
}
#twrap span.label{
  margin: 0;
}
#resultss{
  display: none;
}
@media(min-width: 768px){
  .wrapper.col-sm-9{
    width: 70%;
    margin-left: auto;
    margin-right: auto;
    float: none;
  }
  .panel-body .btn{
    font-size: 1rem;
    padding: 0px 10px;
    margin-bottom: 10px;
    height: auto;
    margin-right: -5px;

  }
  #smartkey{
    width: 98%;
  }
}
`

if (typeof css !== "undefined" || css !== null){
  if (typeof GM_addStyle !== "undefined") {
      GM_addStyle(css)
  } else {
      let styleNode = document.createElement("style")
      styleNode.appendChild(document.createTextNode(css))
      ;(document.querySelector("head") || document.documentElement).appendChild(styleNode)
  }
}

let sSearch = document.querySelector("#smartkey");
if (!sSearch) return
sSearch.disabled = false;
sSearch.placeholder = "SmartSearch is turned on. Type away...";