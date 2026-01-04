// ==UserScript==
// @name         京东自营自动补充数据的脚本
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  京东自营自动补充数据的脚本!
// @note    2023.04.28-V0.4 首页类目匹配
// @note    2023.04.23-V0.2 从类目包含匹配修改为绝对相等匹配，容错处理
// @author       WinterSun
// @match        https://vendor.jd.com/vc/qualification/getQualificationBrandList
// @grant        http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/464518/%E4%BA%AC%E4%B8%9C%E8%87%AA%E8%90%A5%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%85%E6%95%B0%E6%8D%AE%E7%9A%84%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/464518/%E4%BA%AC%E4%B8%9C%E8%87%AA%E8%90%A5%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%85%E6%95%B0%E6%8D%AE%E7%9A%84%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function initStyles() {
        let style = document.createElement("style");
        style.appendChild(document.createTextNode(`#ex-accountList-wrap {    left: -152px;    top: -16px;    /* max-height: 330px;    overflow-y: scroll;    scrollbar-width: none;    -ms-overflow-style: none; */    -webkit-transition: all .2s cubic-bezier(.22,.58,.12,.98);    -o-transition: all cubic-bezier(.22,.58,.12,.98) .2s;    -moz-transition: all cubic-bezier(.22,.58,.12,.98) .2s;    transition: all .2s cubic-bezier(.22,.58,.12,.98);    -webkit-transform-origin: 80% 0;    -moz-transform-origin: 80% 0;    -ms-transform-origin: 80% 0;    -o-transform-origin: 80% 0;    transform-origin: 80% 0;    -webkit-animation: scale-in-ease .5s cubic-bezier(.22,.58,.12,.98);    -moz-animation: scale-in-ease cubic-bezier(.22,.58,.12,.98) .5s;    -o-animation: scale-in-ease cubic-bezier(.22,.58,.12,.98) .5s;    animation: scale-in-ease .5s cubic-bezier(.22,.58,.12,.98);}/* #ex-accountList-wrap::-webkit-scrollbar {    display: none;} */.ex-accountList-item {    padding: 10px;    display: flex;    border-radius: 10px;    align-items: center;}.ex-accountList-item:hover {    background-color: rgb(244,244,244);}#ex-accountList-iframe {    display: none;}#ex-accountList-iframe2 {    display: none;}#ex-accountList-item-add {    padding: 10px;    text-align: center;    margin-bottom:0px;    border-radius: 10px;}#ex-accountList-item-add:hover {    background-color: rgb(244,244,244);}.ex-accountList-item__imgWrap {    flex: 0 0 25%;}.ex-accountList-item__img {    width: 50px;    height: 50px;    border-radius: 50%;}.ex-accountList-item__name {    line-height: 50px;    flex: 0 0 55%;}.ex-accountList-item__btn {    height: 30px;    width: 50px;    border-radius: 10px;    align-items: center;    flex: auto;    text-align: center;    line-height: 28px;    color: white;    background-color: rgb(245,108,108);}.ex-accountList-item__btn:hover {    background-color: rgb(247,137,137);}#ex-accountList-icon:hover > #ex-accountList-wrap {    display: block;}#ex-audio-line {    cursor: pointer;}.bag-info {    position: absolute;    background-color: rgba(0, 0, 0, 0.6);    color: white;    width: 20px;    font-weight: 800;    height: 20px;    text-align: center;}.bag-button {    color: rgb(255, 255, 255);    text-align: center;    height: 15px;    line-height: 15px;    cursor: pointer;    margin-left: 5px;    background: rgb(70, 171, 255);    border-radius: 9px;    padding: 0px 10px;    right: 20px;}.bloop {	background-color: rgba(255,255,255,0.9);	width: 100%;	height: 200px;	position: relative;	bottom: 200px;	display: none;	z-index: 1015;}.bloop__switch {	position: absolute;	right: 0;	bottom: 0;}.bloop__mode {	display: inline-block;}#bloop__select {	width: 150px;}.barragePanel__funcPanel {    position: absolute;    width: 232px;    height: 270px;    display: block;    background: white;    overflow-y: scroll;}.barragePanel__funcPanel::-webkit-scrollbar {display:none}.barragePanel__muteTime {    position: absolute;    left: 25px;    top: 123px;    z-index: 5;}#copy-real-live {    cursor: pointer;}.ex-icon {	display: inline-block;	vertical-align: middle;	margin-right: 8px;	-moz-user-select:none; /*火狐*/    -webkit-user-select:none; /*webkit浏览器*/    -ms-user-select:none; /*IE10*/    -khtml-user-select:none; /*早期浏览器*/    user-select:none;}.extool {	background-color: rgba(255,255,255,0.9);	width: 100%;	height: 200px;	position: relative;	bottom: 200px;	display: none;	z-index: 1015;}.extool__switch {	position: absolute;	right: 0;	bottom: 0;}.extool__bsize,.extool__sendgift {	margin-bottom: 5px;}.extool__redpacket_room,.extool__gold {	display: inline-block;}.ex_giftAnimation {	width: 100%;	height: 100%;	position: absolute;	z-index: 50;	pointer-events: none;}.ex-panel {	position: absolute;	bottom: 32px;	right: 36px;	background-color: rgba(255,255,255,0.9);	display: none;	border: 2px rgb(234,173,26) solid;	z-index: 1015;	user-select: none;}.ex-panel__wrap {	display: flex;	align-items: center;	justify-content: center;	width: 100%;	height: 100%;}.ex-panel__icon {	margin: 0 10px;	display: block;	position: relative;	padding: 5px;	transition: 0.5s;}.ex-panel__icon:hover {	transform: scale(1.15);}.ex-panel__tip {	display:none;	background:#f00;	border-radius:50%;	width:8px;	height:8px;	top:0px;	right:0px;	position:absolute;}#refreshFollowList {    color: grey;position: absolute;right: 5px;top:0px;cursor: default;}.barrageSpeed {    position: absolute;    right: 10px;    top: -20px;    color: rgba(0,0,0,0.5);    cursor: default;    z-index: 0;}.enter__panel {    width: 100%;    display: none;    margin-top: 4px;}#enter__title {    cursor: pointer;    user-select: none;}#enter__select {    width: 190px;}.enter__option {    margin-top: 5px;}#enter__enterId {    width: 40px;}#enter__reply {    width: 150px;}#enter__word {    width: 140px;}#enter__level {    width: 25px;    text-align: center;}#enter__export {    cursor: pointer;    color: royalblue;    margin-left: 10px;}#enter__import {    cursor: pointer;    color: royalblue;    margin-left: 5px;}.gift__panel {    width: 100%;    display: none;    margin-top: 4px;}#gift__title {    cursor: pointer;    user-select: none;}#gift__select {    width: 113px;}.gift__option {    margin-top: 5px;}#gift__giftId {    width: 40px;}#gift__reply {    width: 150px;}#gift__export {    cursor: pointer;    color: royalblue;    margin-left: 10px;}#gift__import {    cursor: pointer;    color: royalblue;    margin-left: 5px;}.livetool {	background-color: rgba(255,255,255,0.9);	width: 100%;	height: 290px;	position: relative;	bottom: 290px;	display: none;	z-index: 1015;}.livetool__cell {	position: relative;    display: -webkit-box;    display: -webkit-flex;    display: flex;    box-sizing: border-box;    width: 100%;    padding: 10px 16px;    overflow: hidden;    color: #323233;    font-size: 14px;    line-height: 24px;	background-color: #fff;	border-bottom: 1px solid rgba(0,0,0,0.2);	flex-wrap: wrap;    -webkit-flex-wrap: wrap;}.livetool__cell_title {	flex: 1;    -webkit-box-flex: 1;}.livetool__cell_option {	text-align: right;}.livetool__cell_switch {	float: right;}.mute__panel {    width: 100%;    display: none;    margin-top: 4px;}#mute__title {    cursor: pointer;    user-select: none;}#mute__idlist {    cursor: pointer;    color: royalblue;    margin-left: 10px;}#mute__export, #mute__import {    cursor: pointer;    color: royalblue;    margin-left: 5px;}#mute__select {    width: 110px;}.mute__option {    margin-top: 5px;}#mute__word {    width: 70px;}#mute__count {    width: 30px;}#mute__time {    width: 65px;}.exRankPoint {    position: absolute;    right: 16px;}.exRankPoint--top {    position: absolute;    bottom: -12px;    right: 0;    left: 0;}.reply__panel {    width: 100%;    display: none;    margin-top: 4px;}#reply__title {    cursor: pointer;    user-select: none;}#reply__select {    /* width: 190px; */    width: 100px;}#reply__time {    width: 35px;}.reply__option {    margin-top: 5px;}#reply__word {    width: 70px;}#reply__reply {    width: 147px;}#reply__export {    cursor: pointer;    color: royalblue;    margin-left: 10px;}#reply__import {    cursor: pointer;    color: royalblue;    margin-left: 5px;}.livetool__Treasure {    width: 100%;    position: relative;    z-index: 999;}.vote__panel {    width: 100%;    display: none;    margin-top: 4px;}#vote__title {    cursor: pointer;    user-select: none;}#vote__select {    width: 100px;}.vote__option {    margin-top: 5px;}#vote__theme {    width: 70px;}#vote__options {    width: 133px;}#vote__time {    width: 35px;}#vote__show-result {    cursor: pointer;    color: royalblue;    margin-left: 10px;}.vote__result {    position: absolute;    top: 0px;    width: 300px;    background: rgba(255,255,255,0.85);    left: 0px;    z-index: 999;    padding: 5px;    border-radius: 10px;    user-select: none;    display: none;}#vote__result-theme {    font-size: 20px;    font-weight: 600;    margin-bottom: 10px;}#vote__result-close {    position: absolute;    top: 5px;    right: 10px;    font-size: 14px;    cursor: pointer;    color: gray;}.vote__option-wrap {    margin-bottom: 10px;}.vote__option-choice {    display: inline-block;    font-size: 14px;}.vote__option-num {    float: right;    font-size: 14px;}.vote__progress {    width: 100%;    background-color: #ddd;    border-radius: 10px;}.vote__progress-bar {    width: 0%;    height: 14px;    background-color: #4CAF50;    text-align: center;    line-height: 30px;    border-radius: 10px;}.exlottery {	background-color: rgba(255,255,255,1);	width: 100%;	height: 250px;	position: relative;	bottom: 250px;	display: none;	z-index: 1015;    overflow: auto;    padding: 0 10px;    box-sizing: border-box;}.lottery__nodata {    z-index: 998;    position: absolute;    left:50%;    top:50%;    transform: translate(-50%, -50%);    color: #606266;}.lottery__wrap {    display: flex;    flex-direction: column;    z-index: 999;}.lottery__a:hover .lottery__item {    background-color: rgb(244,244,244);}.lottery__item {    display: flex;    padding: 5px 0;    border-bottom: 1px solid #d0d0d0;    color: #606266;}.lottery__img img {    width: 150px;    border-radius: 5px;}.lottery__anchor {    position: absolute;    background-color: rgba(255,255,255,0.9);    border-radius: 5px 0px 5px 0px;}.lottery__info {    display: flex;    justify-content: space-evenly;    flex-direction: column;    margin-left: 10px;    overflow: hidden;}.lottery__prize {    white-space: nowrap;    text-overflow: ellipsis;    word-break: break-all;    font-size: 14px;}.lottery__expireTime {    position: absolute;    margin-top: -18px;    background-color: rgba(255,255,255,0.9);    border-radius: 0px 5px 0px 5px;} /*滚动条样式*/.exlottery::-webkit-scrollbar {    width: 4px;    }.exlottery::-webkit-scrollbar-thumb {    border-radius: 10px;    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);    background: rgba(0,0,0,0.2);}.exlottery::-webkit-scrollbar-track {    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);    border-radius: 0;    background: rgba(0,0,0,0.1);}.lottery__func {    display: flex;    justify-content: space-between;    margin-top: 5px;    user-select: none;    border-bottom: 1px solid #d0d0d0;}.lottery__notice,#lottery-refresh {    cursor: pointer;    color: #606266;}.miniprogram__panel {    position: absolute;    right: 43px;    bottom: 100px;    animation: move-in 0.75s;    z-index: 101;    text-align: center;    display: none;}.miniprogram__wrap {    overflow: hidden;    background-color: white;    border-radius: 5%;    width: 200px;    box-shadow: 0px 2px 20px 0px #888888;    font-size: 14px;}.miniprogram__triangle {    width: 0px;    height: 0px;    border-color: white transparent transparent transparent;    border-style: solid;    border-width: 10px;    position: absolute;    left: 100px;}.month-cost {    margin-right: 5px;    cursor: default;    -moz-user-select:none;/*火狐*/    -webkit-user-select:none;/*webkit浏览器*/    -ms-user-select:none;/*IE10*/    -khtml-user-select:none;/*早期浏览器*/    user-select:none;}.monthcost__icon {    position: relative;    top: 3px;    cursor: pointer;    margin-left: 3px;}#ex-point {    cursor: pointer;    float: left;    line-height: 30px;    -moz-user-select:none; /*火狐*/    -webkit-user-select:none; /*webkit浏览器*/    -ms-user-select:none; /*IE10*/    -khtml-user-select:none; /*早期浏览器*/    user-select:none;}#point__value {    color: #333;}#ex-exchange {    position: absolute;    left: 0;    bottom: 37px;    z-index: 100;}.exchange__panel {    width: 400px;    height: 500px;    position: relative;}.exchange__wrap {    width: 400px;    height: 500px;    background-color: white;    border-radius: 3%;    overflow-y: scroll;    overflow-x: hidden;    box-shadow: 0px 0px 20px 0px #888888;}.exchange__wrap::-webkit-scrollbar {    display:none}.exchange__close {    position: absolute;    color: rgb(127, 127, 137);    right: 10px;    top: 5px;    font-size: 15px;    cursor: pointer;    z-index: 101;}.item__wrap {    width: 100%;    height: 130px;    border-bottom: 1px solid rgba(121,127,137,0.4);    position: relative;}.item__pic {    left: 10px;    top: 10px;    position: absolute;    height: 110px;    width: 110px;}.item__name {    position: absolute;    top: 7px;    left: 130px;    color: #353536;;    font-size: 15px;    margin-right: 10px;}.item__description {    position: absolute;    top: 32px;    left: 130px;    font-size: 12px;    margin-right: 10px;    color: #969799;}.item__num {    position: absolute;    bottom: 27px;    left: 130px;    font-size: 12px;    color: #969799;}.item__price {    position: absolute;    bottom: 7px;    left: 130px;    font-size: 14px;    color: rgb(255,93,35);    font-weight: 600;}.item__exchange {    position: absolute;    bottom: 8px;    right: 10px;    font-size: 14px;    color: white;    text-align: center;    width: 80px;    height: 25px;        background-color: rgb(255,93,35);    border-radius: 999px;    cursor: pointer;}#ex-pointlist {    position: absolute;    width: 300px;    height: 400px;    background-color: white;    border-radius: 3%;    overflow: auto;    z-index: 100;    bottom: 37px;}#ex-pointlist::-webkit-scrollbar {    display:none}.pointlist__wrap {    width: 100%;    height: 100%;    margin: 15px 0;    position: absolute;}.pointlist__close {    position: absolute;    color: rgb(127, 127, 137);    right: 7px;    font-size: 15px;    cursor: pointer;}.pointlist__wrap table {    border-collapse: collapse;    margin: 0 auto;    text-align: center;}.pointlist__wrap td,.pointlist__wrap th {    border: 1px solid #cad9ea;    color: #666;    height: 30px;    width: 85px;}.pointlist__wrap thead th {    background-color: #CCE8EB;    width: 100px;}.pointlist__wrap tr:nth-child(odd) {    background: #fff;}.pointlist__wrap tr:nth-child(even) {    background: #F5FAFA;}.point__panel {    position: absolute;    left: 0px;    bottom: 37px;    display: none;    animation: move-in 0.75s;    z-index: 101;}@keyframes move-in {    0% {        opacity: 0;    }    100% {        opacity: 0.95;    }}.panel__wrap {    overflow: hidden;    background-color: white;    border-radius: 5%;    width: 120px;    box-shadow: 0px 2px 20px 0px #888888;    font-size: 14px;}.panel__cell {    width: 100%;    height: 37px;    line-height: 37px;    border-bottom: 1px solid rgba(121,127,137,0.4);    text-align: center;    cursor: pointer;}.panel__cell:hover {    background-color: rgb(217, 217, 217);    transition: 0.75s;}.panel__triangle {    width: 0px;    height: 0px;    border-color: white transparent transparent transparent;    border-style: solid;    border-width: 10px;    position: absolute;    left: 35px;}#ex-record {    width: 300px;    height: 400px;    position: absolute;    bottom: 67px;    z-index: 100;}.record__close {    position: absolute;    color: rgb(127, 127, 137);    right: -20px;    font-size: 15px;    cursor: pointer;}.records__wrap {    width: 100%;    height: 100%;    background-color: white;    border-radius: 3%;    box-shadow: 0px 0px 20px 0px #888888;    padding: 15px;    overflow-y: scroll;    overflow-x: hidden;}.records__wrap::-webkit-scrollbar {    display:none}.record__wrap {    height: 50px;    width: 100%;    border: 1px solid rgba(121,127,137,0.4);    margin-bottom: 10px;    display: -webkit-box;    display: -moz-box;     display: -ms-flexbox;    display: -webkit-flex;     display: flex;     transition: 0.75s;    cursor: pointer;}.record__wrap:hover {    background-color: #e9f5ff;}.record__left {    flex: 1;    position: relative;}.record__name {    position: absolute;    flex: 1;    color: #353536;;    font-size: 15px;    top: 2px;    margin-left: 5px;}.record__updatetime {    position: absolute;    margin-left: 5px;    font-size: 12px;    bottom: 2px;    color: #969799;}.record__price {    line-height: 50px;    color: rgb(255,93,35);    margin-right: 10px;}.record__pagenav {    display: -webkit-box;    display: -moz-box;     display: -ms-flexbox;    display: -webkit-flex;     display: flex;     width: 310px;    position: absolute;    bottom: -20px;    padding-left: 10px;    padding-right: 10px;    cursor: pointer;}.record__prev {    flex: 1;    text-align: center;    border: 1px solid rgba(121,127,137,0.8);    transition: 0.75s;    color: white;    background-color: rgb(57,169,237);}.record__prev:hover {    background-color: #7167ff;}.record__next {    flex: 1;    text-align: center;    border: 1px solid rgba(121,127,137,0.8);    transition: 0.75s;    background-color: rgb(57,169,237);    color: white;}.record__next:hover {    background-color: #7167ff;}.exVideoDiv {    width: 500px;    height: 250px;    background-color: rgba(255, 255, 255, 0);    position: absolute;    z-index: 1015;}.exVideoPlayer {    width: 100%;    height: 100%;    cursor: move;}.exVideoScale {    width: 10px;    height: 10px;    overflow: hidden;    cursor: se-resize;    position: absolute;    right: 0;    bottom: 0;    background-color: rgb(231, 57, 57);}.exVideoInfo {    width: 100%;    height: 30px;    background-color: gray;    position: absolute;    top: -30px;    line-height: 30px;}.exVideoClose {    width: 30px;    float: right;    color: white;}.exVideoQn, .exVideoCDN {    margin-left: 5px;}.exVideoRID {    margin: 0px 5px;    font-weight: 800;    font-size: medium;}#popup-player__prompt {    display: none;}.real-audience {    cursor: pointer;    display: flex;    padding: 0 7px;    line-height: 33px;}/* #refresh-video {    float: left;    width: 24px;    height: 24px;    margin-right: 5px;    cursor: pointer;    background-size: contain;} */#refresh-video2 {    display: none;    position: absolute;    top: 20px;    right: 20px;    cursor: pointer;}#refresh-video2-svg {    fill: rgba(0,0,0,.6)}.refresh-barrage {    display: inline-block;    vertical-align: top;    margin: 0 2px;    padding: 0 8px;    height: 22px;    line-height: 21px;    background-color: #fff;    border: 1px solid #e5e4e4;    -webkit-border-radius: 4px;    -moz-border-radius: 4px;    border-radius: 4px;    cursor: pointer;}#refresh-barrage__svg {    vertical-align: middle;}#ex-camera {    background: rgba(0,0,0,0.7);    position: absolute;    right: 20px;    bottom: 190px;    z-index: 10;    width: 60px;    height: 60px;    cursor: pointer;    -webkit-border-radius: 50%;    -moz-border-radius: 50%;    border-radius: 50%;    cursor: pointer;    display: none;    justify-content: center;    align-items: center;    border: 2px solid #2d2c2c;    box-sizing: border-box;}#ex-camera:hover > svg > path {    fill: rgb(252, 199, 84);}#ex-camera:active > svg > path {    fill: rgb(253, 60, 60);}#ex-cinema:hover > .cinema__wrap {    display: block;}.cinema__wrap {    display: none;    margin: 0;    padding: 0;    border: 1px solid #e5e5e5;    background: #fff;    position: absolute;    left: 201px;    min-width: 100px;    top: 130px;}.cinema__panel {    position: absolute;    border: 1px solid #000;    border-radius: 4px;    transform: translateY(calc(-4px - 100%)) translateX(-50%);    left: 33%;    background-color: #000;    opacity: .75;    width: 70px;}.cinema__panel li {    padding: 0 2px;    white-space: nowrap;    color: #fff;    text-align: center;    cursor: pointer;}.cinema__panel li:hover {    background-color: rgb(85, 85, 85);}  #ex-joysound {    float: left;    width: 24px;    height: 24px;    margin-right: 10px;    cursor: pointer;    background-size: contain;    pointer-events: all;}#ex-joysound img {    width: 24px;    height: 24px;}#ex-filter {    float: left;    width: 24px;    height: 24px;    margin-right: 10px;    cursor: pointer;    background-size: contain;    pointer-events: all;}.filter__wrap {    display: none;    position: relative;    height: 100%;    margin-right: -15px;    border-radius: 4px;    -webkit-user-select: none;    -moz-user-select: none;    -ms-user-select: none;    user-select: none;    float: left;    right: -12px;    bottom: 10px;}.filter__panel {    position: absolute;    border: 1px solid #000;    border-radius: 4px;    transform: translateY(calc(-4px - 100%)) translateX(-50%);    left: 33%;    background-color: #000;    opacity: .75;    width: 300px;    padding-top: 10px;    padding-left: 10px;    padding-right: 10px;}.filter__panel li {    padding: 0 2px;    white-space: nowrap;    color: #fff;    text-align: center;    cursor: pointer;}.filter__panel li:hover {    background-color: rgb(85, 85, 85);}.filter__scroll {    width: 255px;    height: 5px;    background: #ccc;    position: relative;    display: inline-block;}.filter__scroll-bar {    width: 15px;    height: 15px;    background: #369;    position: absolute;    top: -5px;    left: 100px;    cursor: pointer;    border-radius: 100%;}.filter__scroll-mask {    position: absolute;    left: 0;    top: 0;    background: #369;    width: 100px;    height: 5px;}.filter__title {    color: white;    display: inline-block;    cursor: initial;    margin-right: 2px;}#filter__select {    width: 260px;    float: right;}.filter__filter {    margin-top: 5px;}#ex-videospeed:hover > .videospeed__wrap {    display: block;}.videospeed__wrap {    display: none;    margin: 0;    padding: 0;    border: 1px solid #e5e5e5;    background: #fff;    position: absolute;    left: 201px;    min-width: 100px;    top: 120px;}.videospeed__panel {    position: absolute;    border: 1px solid #000;    border-radius: 4px;    transform: translateY(calc(-4px - 100%)) translateX(-50%);    left: 33%;    background-color: #000;    opacity: .75;    width: 70px;}.videospeed__panel li {    padding: 0 2px;    white-space: nowrap;    color: #fff;    text-align: center;    cursor: pointer;}.videospeed__panel li:hover {    background-color: rgb(85, 85, 85);}  #ex-videosync {    float: left;    width: 24px;    height: 24px;    margin-left: 20px;    cursor: pointer;    background-size: contain;}.weeklypanel__panel-wrap {    width: 100%;    height: 100%;    z-index: 999;    background-color: rgba(0, 0, 0, 0.9);    position: absolute;    top: 0;    left: 0;    display: flex;    justify-content: center;    align-items: center;}.weeklypanel__panel {    height: 600px;    width: 500px;    background-color: white;    border-radius: 20px;    position: fixed;    top: 0;    left: 0;    right: 0;    bottom: 0;    margin: auto;}.weeklypanel__content {    position: relative;    top: 50%;    transform: translateY(-50%);    text-align: center;}.weeklypanel__text {    font-size: 18px;}.weeklypanel__text a {    font-weight: bold;    font-size: 24px;}.weeklypanel__close {    font-size: 30px;    font-weight: bold;    position: absolute;    right: 15px;    cursor: pointer;}.noticejs-top{top:0;width:100% !important}.noticejs-top .item{border-radius:0 !important;margin:0 !important}.noticejs-topRight{top:10px;right:10px}.noticejs-topLeft{top:10px;left:10px}.noticejs-topCenter{top:10px;left:50%;transform:translate(-50%)}.noticejs-middleLeft,.noticejs-middleRight{right:10px;top:50%;transform:translateY(-50%)}.noticejs-middleLeft{left:10px}.noticejs-middleCenter{top:50%;left:50%;transform:translate(-50%,-50%)}.noticejs-bottom{bottom:0;width:100% !important}.noticejs-bottom .item{border-radius:0 !important;margin:0 !important}.noticejs-bottomRight{bottom:10px;right:10px}.noticejs-bottomLeft{bottom:10px;left:10px}.noticejs-bottomCenter{bottom:10px;left:50%;transform:translate(-50%)}.noticejs{font-family:Helvetica Neue,Helvetica,Arial,sans-serif}.noticejs .item{margin:0 0 10px;border-radius:3px;overflow:hidden}.noticejs .item .close{float:right;font-size:18px;font-weight:700;line-height:1;color:#fff;text-shadow:0 1px 0 #fff;opacity:1;margin-right:7px}.noticejs .item .close:hover{opacity:.5;color:#000}.noticejs .item a{color:#fff;border-bottom:1px dashed #fff}.noticejs .item a,.noticejs .item a:hover{text-decoration:none}.noticejs .success{background-color:#64ce83}.noticejs .success .noticejs-heading{background-color:#3da95c;color:#fff;padding:10px}.noticejs .success .noticejs-body{color:#fff;padding:10px}.noticejs .success .noticejs-body:hover{visibility:visible !important}.noticejs .success .noticejs-content{visibility:visible}.noticejs .info{background-color:#3ea2ff}.noticejs .info .noticejs-heading{background-color:#067cea;color:#fff;padding:10px}.noticejs .info .noticejs-body{color:#fff;padding:10px}.noticejs .info .noticejs-body:hover{visibility:visible !important}.noticejs .info .noticejs-content{visibility:visible}.noticejs .warning{background-color:#ff7f48}.noticejs .warning .noticejs-heading{background-color:#f44e06;color:#fff;padding:10px}.noticejs .warning .noticejs-body{color:#fff;padding:10px}.noticejs .warning .noticejs-body:hover{visibility:visible !important}.noticejs .warning .noticejs-content{visibility:visible}.noticejs .error{background-color:#e74c3c}.noticejs .error .noticejs-heading{background-color:#ba2c1d;color:#fff;padding:10px}.noticejs .error .noticejs-body{color:#fff;padding:10px}.noticejs .error .noticejs-body:hover{visibility:visible !important}.noticejs .error .noticejs-content{visibility:visible}.noticejs .progressbar{width:100%}.noticejs .progressbar .bar{width:1%;height:30px;background-color:#4caf50}.noticejs .success .noticejs-progressbar{width:100%;background-color:#64ce83;margin-top:-1px}.noticejs .success .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#3da95c}.noticejs .info .noticejs-progressbar{width:100%;background-color:#3ea2ff;margin-top:-1px}.noticejs .info .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#067cea}.noticejs .warning .noticejs-progressbar{width:100%;background-color:#ff7f48;margin-top:-1px}.noticejs .warning .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#f44e06}.noticejs .error .noticejs-progressbar{width:100%;background-color:#e74c3c;margin-top:-1px}.noticejs .error .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#ba2c1d}@keyframes noticejs-fadeOut{0%{opacity:1}to{opacity:0}}.noticejs-fadeOut{animation-name:noticejs-fadeOut}@keyframes noticejs-modal-in{to{opacity:.3}}@keyframes noticejs-modal-out{to{opacity:0}}.noticejs-rtl .noticejs-heading{direction:rtl}.noticejs-rtl .close{float:left !important;margin-left:7px;margin-right:0 !important}.noticejs-rtl .noticejs-content{direction:rtl}.noticejs{position:fixed;z-index:10050;width:320px}.noticejs::-webkit-scrollbar{width:8px}.noticejs::-webkit-scrollbar-button{width:8px;height:5px}.noticejs::-webkit-scrollbar-track{border-radius:10px}.noticejs::-webkit-scrollbar-thumb{background:hsla(0,0%,100%,.5);border-radius:10px}.noticejs::-webkit-scrollbar-thumb:hover{background:#fff}.noticejs-modal{position:fixed;width:100%;height:100%;background-color:#000;z-index:10000;opacity:.3;left:0;top:0}.noticejs-modal-open{opacity:0;animation:noticejs-modal-in .3s ease-out}.noticejs-modal-close{animation:noticejs-modal-out .3s ease-out;animation-fill-mode:forwards}.noticejs .special{background-color:rgb(160,37,160)}.noticejs .special .noticejs-heading{background-color:rgb(110,26,110);color:#fff;padding:10px}.noticejs .special .noticejs-body{color:#fff;padding:10px}.noticejs .special .noticejs-body:hover{visibility:visible !important}.noticejs .special .noticejs-content{visibility:visible}.noticejs .special .noticejs-progressbar{width:100%;background-color:rgb(160,37,160);margin-top:-1px}.noticejs .special .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:rgb(110,26,110)}/** * PostbirdAlertBox.js * -    原生javascript弹框插件 * Author:  Postbird - http://www.ptbird.cn * License: MIT * Date:    2017-09-23 */.postbird-box-container {    width: 100%;    height: 100%;    overflow: hidden;    position: fixed;    top: 0;    left: 0;    z-index: 9999;    background-color: rgba(0, 0, 0, 0.2);    display: block;    -webkit-user-select: none;    -moz-user-select: none;    -ms-user-select: none;    user-select: none}.postbird-box-container.active {    display: block}.postbird-box-content {    min-width: 400px;    max-width: 600px;    min-height: 150px;    background-color: #fff;    border: solid 1px #dfdfdf;    position: absolute;    top: 50%;    left: 50%;    transform: translate(-50%, -50%);    margin-top: -100px}.postbird-box-header {    width: 100%;    padding: 10px 15px;    position: relative;    font-size: 1.1em;    letter-spacing: 2px}.postbird-box-close-btn {    cursor: pointer;    font-weight: 700;    color: #000;    float: right;    opacity: .5;    font-size: 1.3em;    margin-top: -3px;    display: none}.postbird-box-close-btn:hover {    opacity: 1}.postbird-box-text {    box-sizing: border-box;    width: 100%;    padding: 0 10%;    text-align: center;    line-height: 40px;    font-size: 20px;    letter-spacing: 1px}.postbird-box-footer {    width: 100%;    position: absolute;    padding: 0;    margin: 0;    bottom: 0;    display: flex;    display: -webkit-flex;    justify-content: space-around;    border-top: solid 1px #dfdfdf;    align-items: flex-end}.postbird-box-footer .btn-footer {    line-height: 44px;    border: 0;    cursor: pointer;    background-color: #fff;    color: #0e90d2;    font-size: 1.1em;    letter-spacing: 2px;    transition: background-color .5s;    -webkit-transition: background-color .5s;    -o-transition: background-color .5s;    -moz-transition: background-color .5s;    outline: 0}.postbird-box-footer .btn-footer:hover {    background-color: #e5e5e5}.postbird-box-footer .btn-block-footer {    width: 100%}.postbird-box-footer .btn-left-footer,.postbird-box-footer .btn-right-footer {    position: relative;    width: 100%}.postbird-box-footer .btn-left-footer::after {    content: "";    position: absolute;    right: 0;    top: 0;    background-color: #e5e5e5;    height: 100%;    width: 1px}.postbird-box-footer .btn-footer-cancel {    color: #333}.postbird-prompt-input {    width: 100%;    padding: 5px;    font-size: 16px;    border: 1px solid #ccc;    outline: 0}.onoffswitch {    position: relative; width: 45px;    -webkit-user-select:none; -moz-user-select:none; -ms-user-select: none;}.onoffswitch-checkbox {    position: absolute;    opacity: 0;    pointer-events: none;}.onoffswitch-label {    display: block; overflow: hidden; cursor: pointer;    height: 20px; padding: 0; line-height: 20px;    border: 2px solid #E3E3E3; border-radius: 20px;    background-color: #FFFFFF;    transition: background-color 0.3s ease-in;}.onoffswitch-label:before {    content: "";    display: block; width: 20px; margin: 0px;    background: #FFFFFF;    position: absolute; top: 0; bottom: 0;    right: 23px;    border: 2px solid #E3E3E3; border-radius: 20px;    transition: all 0.3s ease-in 0s; }.onoffswitch-checkbox:checked + .onoffswitch-label {    background-color: #3AAD38;}.onoffswitch-checkbox:checked + .onoffswitch-label, .onoffswitch-checkbox:checked + .onoffswitch-label:before {   border-color: #3AAD38;}.onoffswitch-checkbox:checked + .onoffswitch-label:before {    right: 0px; }.layui-timeline {    padding-left: 5px;}.layui-timeline-item {    position: relative;    padding-bottom: 20px;}li {    list-style: none;}.layui-timeline-item:first-child::before {    display: block;}.layui-timeline-item:last-child::before {    content: '';    position: absolute;    left: 5px;    top: 0;    z-index: 0;    width: 0;    height: 100%;}.layui-timeline-item::before {    content: '';    position: absolute;    left: 5px;    top: 0;    z-index: 0;    width: 1px;    height: 100%;}.layui-timeline-item::before,hr {    background-color: #e6e6e6;}.layui-timeline-axis {    position: absolute;    left: -5px;    top: 0;    z-index: 10;    width: 20px;    height: 20px;    line-height: 20px;    background-color: #fff;    color: #5FB878;    border-radius: 50%;    text-align: center;    cursor: pointer;}.layui-icon {    font-family: layui-icon !important;    font-size: 16px;    font-style: normal;}.layui-timeline-content {    padding-left: 25px;}.layui-text {    line-height: 22px;    font-size: 14px;    color: rgb(85,85,85);}.layui-timeline-title {    position: relative;}`));
        document.head.appendChild(style);
    }

    setTimeout(() => {
        initStyles();
        add();
    }, 1500)


    function clickBotton() {
        setTimeout(function () {
            if ($('#myModal').attr("aria-hidden") === 'true') {
                $("#addBtn").click();
            }

            setTimeout(function () {

                let brandAutoCodeZ = document.getElementById('brandAutoCodeZ')

                let brandAutoCode = document.getElementById("brandAutoCode")
                brandAutoCode.value = brandAutoCodeZ.value


                //输入类目

                let category = $("#categoryInput").val().trim()

//            const category = '传统滋补>养生茶饮>黄芪'
                let cs = category.split(">")
              
                
                

//                $(".form-control.firstSortCode").find("option:indexOf('" + cs[0] + "')!=-1").attr("selected", true).trigger("change");
                $(".form-control.firstSortCode").find("option:contains('" + cs[0] + "')").map(function () {
                    if ($(this).text() === cs[0]) {
                        $(this).prop("selected", true).trigger("change")
                    }
                });

                setTimeout(function () {
//                    $(".form-control.secondSortCode").find("option:contains('" + cs[1] + "')").attr("selected", true).trigger("change");
                    $(".form-control.secondSortCode").find("option:contains('" + cs[1] + "')").map(function () {
                        if ($(this).text() === cs[1]) {
                            $(this).prop("selected", true).trigger("change")
                        }
                    });
                    setTimeout(function () {
//                        $(".form-control.thirdSortCode").find("option:contains('" + cs[2] + "')").attr("selected", true).trigger("change");
                        $(".form-control.thirdSortCode").find("option:contains('" + cs[2] + "')").map(function () {
                            if ($(this).text() === cs[2]) {
                                $(this).prop("selected", true).trigger("change")
                            }
                        });
                        setTimeout(function () {

                            try {
                                var expiryDate93 = document.getElementById("93expiryDate")
                                expiryDate93.value = $("#expiryDate93").val()
                            } catch (e) {
                                console.log(e)
                            }

                            try {
                                var expiryDate25 = document.getElementById("25expiryDate")
                                expiryDate25.value = $("#expiryDate25").val()
                            } catch (e) {
                                console.log(e)
                            }

                            try {
                                var expiryDate23 = document.getElementById("23expiryDate")
                                expiryDate23.value = $("#expiryDate23").val()
                            } catch (e) {
                                console.log(e)
                            }

                            try {
                                var expiryDate22 = document.getElementById("22expiryDate")
                                expiryDate22.value = $("#expiryDate22").val()
                            } catch (e) {
                                console.log(e)
                            }

                            try {
                                var expiryDate9 = document.getElementById("9expiryDate")
                                expiryDate9.value = $("#expiryDate9").val()
                            } catch (e) {
                                console.log(e)
                            }

                            try {
                                var expiryDate28 = document.getElementById("28expiryDate")
                                expiryDate28.value = $("#expiryDate28").val()
                            } catch (e) {
                                console.log(e)
                            }
                            try {
                                var expiryDate40 = document.getElementById("40expiryDate")
                                expiryDate40.value = $("#expiryDate40").val()
                            } catch (e) {
                                console.log(e)
                            }
                            try {
                                var expiryDate47 = document.getElementById("47expiryDate")
                                expiryDate47.value = $("#expiryDate47").val()
                            } catch (e) {
                                console.log(e)
                            }
                            try {
                                var purchaser = document.getElementById("purchaser")
                                purchaser.value = $("#purchaserz").val()
                            } catch (e) {
                                console.log(e)
                            }
                            try {
                                var brandGrade = document.getElementById("brandGrade")
                                brandGrade.value = '9'
                            } catch (e) {
                                console.log(e)
                            }
                        }, 200)

                    }, 200)
                }, 200)
                //            $(".form-control.secondSortCode").find("option:contains('"+cs[1]+"')").attr("selected",true).trigger("change");
                //            $(".form-control.thirdSortCode").find("option:contains('"+cs[2]+"')").attr("selected",true).trigger("change");
                //$(".form-control.firstSortCode").val(652).trigger("change");
            }, 500)

        }, 100);// setTimeout 0.1秒后执行
    }

    //首页类目选择
    function selectHomeCategory() {
        
        
        
        PostbirdAlertBox.prompt({
            'title': "请输入类目名称",
            'okBtn': '确定',
            onConfirm: function (data) {
                let category = data.trim()

                let cs = category.split(">")
                
                if(cs.length!==3){
                    cs=category.split("	")
                }

                if ( $("#brandSort1Code  option:selected").text()!==cs[0]){
                    $("#brandSort1Code").find("option:contains('" + cs[0] + "')").map(function () {

                        if ($(this).text() === cs[0]) {
                            $(this).prop("selected", true).trigger("change")
                        }
                    });
                }
                
                setTimeout(function () {
                    if ( $("#brandSort2Code  option:selected").text()!==cs[1]){
                        $("#brandSort2Code").find("option:contains('" + cs[1] + "')").map(function () {
                            if ($(this).text() === cs[1]) {
                                $(this).prop("selected", true).trigger("change")
                            }
                        });
                    }
                    
                    setTimeout(function () {
                        if ( $("#brandSort3Code  option:selected").text()!==cs[2]){
                            $("#brandSort3Code").find("option:contains('" + cs[2] + "')").map(function () {
                                if ($(this).text() === cs[2]) {
                                    $(this).prop("selected", true).trigger("change")
                                }
                            });
                        }
                        setTimeout(function () {
                            searchProductLine()
                        },200)
                    },500)
                    
                },500)
                
            },
            onCancel: function (data) {
            },
        });
    }


    function add() {
        var button = document.createElement("button"); //创建一个按钮
        button.textContent = "补充资料"; //按钮内容
        button.style.width = "90px"; //按钮宽度
        button.style.height = "28px"; //按钮高度
        button.style.align = "center"; //文本居中
        button.style.color = "white"; //按钮文字颜色
        button.style.marginTop = "10px"; //按钮文字颜色
        button.style.background = "#e33e33"; //按钮底色
        button.style.border = "1px solid #e33e33"; //边框属性
        button.style.borderRadius = "4px"; //按钮四个角弧度
        button.style.position = 'fixed'
        button.style.top = '1px'
        button.style.right = '50px'
        button.style.zIndex = '1041'
        button.addEventListener("click", clickBotton) //监听按钮点击事件


        var button2 = document.createElement("button"); //创建一个按钮
        button2.textContent = "显示/隐藏输入框"; //按钮内容
        button2.style.width = "100px"; //按钮宽度
        button2.style.height = "28px"; //按钮高度
        button2.style.align = "center"; //文本居中
        button2.style.color = "white"; //按钮文字颜色
        button2.style.marginTop = "10px"; //按钮文字颜色
        button2.style.background = "#5cb85c"; //按钮底色
        button2.style.border = "1px solid #5cb85c"; //边框属性
        button2.style.borderRadius = "4px"; //按钮四个角弧度
        button2.style.position = 'fixed'
        button2.style.top = '1px'
        button2.style.right = '150px'
        button2.style.zIndex = '1041'
        button2.addEventListener("click", showAndHide) //监听按钮点击事件
        var button3 = document.createElement("button"); //创建一个按钮
        button3.textContent = "主页选择类目"; //按钮内容
        button3.style.width = "90px"; //按钮宽度
        button3.style.height = "28px"; //按钮高度
        button3.style.align = "center"; //文本居中
        button3.style.color = "white"; //按钮文字颜色
        button3.style.marginTop = "10px"; //按钮文字颜色
        button3.style.background = "#e33e33"; //按钮底色
        button3.style.border = "1px solid #e33e33"; //边框属性
        button3.style.borderRadius = "4px"; //按钮四个角弧度
        button3.style.position = 'fixed'
        button3.style.top = '1px'
        button3.style.right = '260px'
        button3.style.zIndex = '1041'
        button3.addEventListener("click", selectHomeCategory) //监听按钮点击事件


        //输入框
        {
            var input = document.createElement("input");
            input.id = "categoryInput"
            input.placeholder = '输入类目名称，列如：医疗保健>药食同源>药食同源 '
            input.style.width = '400px'
            input.style.position = 'fixed'
            input.style.top = '50px'
            input.style.right = '50px'
            input.style.zIndex = '9999'
            var input2 = document.createElement("input");
            input2.id = "brandAutoCodeZ"
            input2.placeholder = '请输入品牌ID，列如： 17076'
            input2.style.width = '400px'
            input2.style.position = 'fixed'
            input2.style.top = '80px'
            input2.style.right = '50px'
            input2.style.zIndex = '9999'

            var input3 = document.createElement("input");
            input3.id = "expiryDate93"
            input3.placeholder = '请输入商标注册证/商标申请受理通知书过期时间，列如： 2031-06-13'
            input3.value = '2031-06-13'
            input3.style.width = '400px'
            input3.style.position = 'fixed'
            input3.style.top = '110px'
            input3.style.right = '50px'
            input3.style.zIndex = '9999'
            var input4 = document.createElement("input");
            input4.id = "expiryDate25"
            input4.placeholder = '请输入厂家授权书过期时间，列如： 2031-06-13'
            input4.value = '2023-12-31'
            input4.style.width = '400px'
            input4.style.position = 'fixed'
            input4.style.top = '140px'
            input4.style.right = '50px'
            input4.style.zIndex = '9999'
            var input5 = document.createElement("input");
            input5.id = "expiryDate23"
            input5.placeholder = '京东的授权，列如： 2031-06-13'
            input5.value = '2023-12-31'
            input5.style.width = '400px'
            input5.style.position = 'fixed'
            input5.style.top = '170px'
            input5.style.right = '50px'
            input5.style.zIndex = '9999'
            var input6 = document.createElement("input");
            input6.id = "expiryDate22"
            input6.placeholder = '质检报告，列如： 2031-06-13'
            input6.value = '2099-01-01'
            input6.style.width = '400px'
            input6.style.position = 'fixed'
            input6.style.top = '200px'
            input6.style.right = '50px'
            input6.style.zIndex = '9999'
            var input7 = document.createElement("input");
            input7.id = "expiryDate9"
            input7.placeholder = '食品经营/流通许可证 ，列如： 2031-06-13'
            input7.value = '2024-06-24'
            input7.style.width = '400px'
            input7.style.position = 'fixed'
            input7.style.top = '230px'
            input7.style.right = '50px'
            input7.style.zIndex = '9999'
            var input8 = document.createElement("input");
            input8.id = "expiryDate28"
            input8.placeholder = '食品生产许可证，列如： 2031-06-13'
            //        input8.value='2024-06-24'
            input8.style.width = '400px'
            input8.style.position = 'fixed'
            input8.style.top = '260px'
            input8.style.right = '50px'
            input8.style.zIndex = '9999'
            var input9 = document.createElement("input");
            input9.id = "expiryDate40"
            input9.placeholder = '委托生产/加工协议书，列如： 2031-06-13'
            input9.value = '2025-12-31'
            input9.style.width = '400px'
            input9.style.position = 'fixed'
            input9.style.top = '290px'
            input9.style.right = '50px'
            input9.style.zIndex = '9999'
            var input10 = document.createElement("input");
            input10.id = "expiryDate47"
            input10.placeholder = '生产单位营业执照，列如： 2031-06-13'
            input10.value = '2099-01-01'
            input10.style.width = '400px'
            input10.style.position = 'fixed'
            input10.style.top = '320px'
            input10.style.right = '50px'
            input10.style.zIndex = '9999'
            var input11 = document.createElement("input");
            input11.id = "purchaserz"
            input11.placeholder = '采销'
            //        input11.value = '2099-01-01'
            input11.style.width = '400px'
            input11.style.position = 'fixed'
            input11.style.top = '350px'
            input11.style.right = '50px'
            input11.style.zIndex = '9999'
        }

        var like_comment = document.getElementsByTagName('body')[0]; //getElementsByClassName 返回的是数组，所以要用[] 下标

        like_comment.after(button);
        like_comment.after(button2);
        like_comment.after(button3);

        var div = document.createElement("div");
        div.id = "divz"
        div.style.backgroundColor = '#fff'
        div.style.width = '700px'
        div.style.height = '400px'
        div.style.position = 'fixed'
        div.style.top = '0'
        div.style.right = '0'
        div.style.zIndex = '1041'
        div.style.display = 'none'

//        div.style.display = 'none'
        like_comment.after(div);

        div.appendChild(input)
        div.appendChild(input2)
        div.appendChild(input3)
        div.appendChild(input4)
        div.appendChild(input5)
        div.appendChild(input6)
        div.appendChild(input7)
        div.appendChild(input8)
        div.appendChild(input9)
        div.appendChild(input10)
        div.appendChild(input11)


        $("#divz").append('<leabl style="position: fixed;top: 115px;right: 460px;color: red !important;z-index: 9999;">商标注册证/商标申请受理通知书：</leabl>')
            .append('<leabl style="position: fixed;top: 145px;right: 460px;color: red !important;z-index: 9999;">厂家授权书：</leabl>')
            .append('<leabl style="position: fixed;top: 175px;right: 460px;color: red !important;z-index: 9999;">厂家授权书：</leabl>')

            .append('<leabl style="position: fixed;top: 210px;right: 460px;color: red !important;z-index: 9999;">质检报告:</leabl>')
            .append('<leabl style="position: fixed;top: 240px;right: 460px;color: red !important;z-index: 9999;">食品经营/流通许可证:</leabl>')
            .append('<leabl style="position: fixed;top: 270px;right: 460px;color: red !important;z-index: 9999;">食品生产许可证:</leabl>')
            .append('<leabl style="position: fixed;top: 300px;right: 460px;color: red !important;z-index: 9999;">委托加工协议书:</leabl>')
            .append('<leabl style="position: fixed;top:320px;right: 460px;color: red !important;z-index: 9999;">生产单位营业执照:</leabl>')
            .append('<leabl style="position: fixed;top:350px;right: 460px;color: red !important;z-index: 9999;">采销:</leabl>')

    }


    let current = true;

    function showAndHide() {

        if (current) {
            $("#divz").hide()
            current = !current;
        } else {
            $("#divz").show()
            current = !current;

        }
    }

    // Your code here...
})();


var PostbirdAlertBox = {
    containerClass: "postbird-box-container active",
    box: null,
    textTemplate: {
        title: "提示信息",
        content: "提示内容",
        okBtn: "好的",
        cancelBtn: "取消",
        contentColor: "#000000",
        okBtnColor: "#0e90d2",
        promptTitle: "请输入内容",
        promptOkBtn: "确认",
    },
    getAlertTemplate: function () {
        var temp = '<div class="postbird-box-dialog">' + '<div class="postbird-box-content">' + '<div class="postbird-box-header">' + '<span class="postbird-box-close-btn">×</span>' + '<span class="postbird-box-title">' + "<span >" + this.textTemplate.title + "</span>" + "</span>" + "</div>" + '<div class="postbird-box-text">' + '<span style="color:' + this.textTemplate.contentColor + ';">' + this.textTemplate.content + "</span>" + "</div>" + '<div class="postbird-box-footer">' + '<button class="btn-footer btn-block-footer btn-footer-ok" style="color:' + this.textTemplate.okBtnColor + ';">' + this.textTemplate.okBtn + "</button>" + "</div>" + "</div>" + "</div>";
        return temp
    },
    getConfirmTemplate: function () {
        return '<div class="postbird-box-container">' + '<div class="postbird-box-dialog">' + '<div class="postbird-box-content">' + '<div class="postbird-box-header">' + '<span class="postbird-box-close-btn">×</span>' + '<span class="postbird-box-title">' + "<span >" + this.textTemplate.title + "</span>" + "</span>" + "</div>" + '<div class="postbird-box-text">' + '<span style="color:' + this.textTemplate.contentColor + ';">' + this.textTemplate.content + "?</span>" + "</div>" + '<div class="postbird-box-footer">' + '<button class="btn-footer btn-left-footer btn-footer-cancel" style="color:' + this.textTemplate.cancelBtnColor + ';">' + this.textTemplate.cancelBtn + "</button>" + '<button class="btn-footer btn-right-footer btn-footer-ok"  style="color:' + this.textTemplate.okBtnColor + ';">' + this.textTemplate.okBtn + "</button>" + "</div>" + "</div>" + "</div>" + "</div>"
    },
    getPromptTemplate: function () {
        return '<div class="postbird-box-container">' + '<div class="postbird-box-dialog">' + '<div class="postbird-box-content">' + '<div class="postbird-box-header">' + '<span class="postbird-box-close-btn">×</span>' + '<span class="postbird-box-title">' + "<span >" + this.textTemplate.title + "</span>" + "</span>" + "</div>" + '<div class="postbird-box-text">' + '<input type="text" class="postbird-prompt-input" autofocus="true" >' + "</div>" + '<div class="postbird-box-footer">' + '<button class="btn-footer btn-left-footer btn-footer-cancel" style="color:' + this.textTemplate.cancelBtnColor + ';">' + this.textTemplate.cancelBtn + "</button>" + '<button class="btn-footer btn-right-footer btn-footer-ok"  style="color:' + this.textTemplate.okBtnColor + ';">' + this.textTemplate.okBtn + "</button>" + "</div>" + "</div>" + "</div>" + "</div>"
    },
    alert: function (opt) {
        this.textTemplate.title = opt.title || this.textTemplate.title;
        this.textTemplate.content = opt.content || this.textTemplate.content;
        this.textTemplate.okBtn = opt.okBtn || this.textTemplate.okBtn;
        this.textTemplate.okBtnColor = opt.okBtnColor || this.textTemplate.okBtnColor;
        this.textTemplate.contentColor = opt.contentColor || this.textTemplate.contentColor;
        var box = document.createElement("div"), _this = this;
        box.className = this.containerClass;
        box.innerHTML = this.getAlertTemplate();
        this.box = box;
        document.body.appendChild(this.box);
        var btn = document.getElementsByClassName("btn-footer-ok");
        btn[btn.length - 1].focus();
        btn[btn.length - 1].onclick = function () {
            if (opt.onConfirm) {
                opt.onConfirm()
            }
            _this.removeBox()
        }
    },
    confirm: function (opt) {
        this.textTemplate.title = opt.title || this.textTemplate.promptTitle;
        this.textTemplate.promptPlaceholder = opt.promptPlaceholder || this.textTemplate.promptPlaceholder;
        this.textTemplate.okBtn = opt.okBtn || this.textTemplate.promptOkBtn;
        this.textTemplate.okBtnColor = opt.okBtnColor || this.textTemplate.okBtnColor;
        this.textTemplate.cancelBtn = opt.cancelBtn || this.textTemplate.cancelBtn;
        this.textTemplate.cancelBtnColor = opt.cancelBtnColor || this.textTemplate.cancelBtnColor;
        this.textTemplate.content = opt.content || this.textTemplate.content;
        var box = document.createElement("div"), _this = this;
        this.box = box;
        box.className = this.containerClass;
        box.innerHTML = this.getConfirmTemplate();
        document.body.appendChild(box);
        var okBtn = document.getElementsByClassName("btn-footer-ok");
        okBtn[okBtn.length - 1].focus();
        okBtn[okBtn.length - 1].onclick = function () {
            if (opt.onConfirm) {
                opt.onConfirm()
            }
            _this.removeBox()
        };
        var cancelBtn = document.getElementsByClassName("btn-footer-cancel");
        cancelBtn[cancelBtn.length - 1].onclick = function () {
            if (opt.onCancel) {
                opt.onCancel()
            }
            _this.removeBox()
        }
    },
    prompt: function (opt) {
        this.textTemplate.title = opt.title || this.textTemplate.title;
        this.textTemplate.content = opt.content || this.textTemplate.content;
        this.textTemplate.contentColor = opt.contentColor || this.textTemplate.contentColor;
        this.textTemplate.okBtn = opt.okBtn || this.textTemplate.okBtn;
        this.textTemplate.okBtnColor = opt.okBtnColor || this.textTemplate.okBtnColor;
        this.textTemplate.cancelBtn = opt.cancelBtn || this.textTemplate.cancelBtn;
        this.textTemplate.cancelBtnColor = opt.cancelBtnColor || this.textTemplate.cancelBtnColor;
        var box = document.createElement("div"), _this = this;
        box.className = this.containerClass;
        box.innerHTML = this.getPromptTemplate();
        this.box = box;
        document.body.appendChild(box);
        var promptInput = document.getElementsByClassName("postbird-prompt-input");
        promptInput = promptInput[promptInput.length - 1];
        promptInput.focus();
        var okBtn = document.getElementsByClassName("btn-footer-ok");
        var inputData = promptInput.value;
        okBtn[okBtn.length - 1].focus();
        okBtn[okBtn.length - 1].onclick = function () {
            if (opt.onConfirm) {
                opt.onConfirm(promptInput.value)
            }
            _this.removeBox()
        };
        var cancelBtn = document.getElementsByClassName("btn-footer-cancel");
        cancelBtn[cancelBtn.length - 1].onclick = function () {
            if (opt.onCancel) {
                opt.onCancel(promptInput.value)
            }
            _this.removeBox()
        }
    },
    colse: function () {
        this.removeBox()
    },
    removeBox: function () {
        var box = document.getElementsByClassName(this.containerClass);
        document.body.removeChild(box[box.length - 1])
    }
};
