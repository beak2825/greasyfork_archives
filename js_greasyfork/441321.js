// ==UserScript==
// @name         mteam列表大图
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  try to take over the world!
// @author       You
// @match        https://kp.m-team.cc/*movie.php*
// @match        https://kp.m-team.cc/*adult.php*
// @match        https://kp.m-team.cc/*torrents.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/441321/mteam%E5%88%97%E8%A1%A8%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/441321/mteam%E5%88%97%E8%A1%A8%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==
const $j=jQuery.noConflict();

(function() {
    'use strict';

    const css1="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css";
    load_css(css1);
    //const css2="https://gaoqing.fm/static/css/style.css?v=219271224";
    //load_css(css2);
    load_style();
    //console.log($("torrents"));
    //alert("i'm here");
    // Your code here...
    var css = "td.torrentimg img {  max-width: unset !important; width: 200px !important; height: auto !important;};"
    //$("head").append("<style>"+css+"</style>");
    //mteam_addStyle(css);



    //document.body.append(html);
    //$j("body").append(html);
    $j("#form_torrent").hide();
    const html=dealPage();
    //$j("body").append(html);
    //$j("#outer").append(html);
    $j("#outer > table.main > tbody > tr > td > p").before(html);
})();
function dealPage()
{
    let html=`<script type="text/javascript">
    function  defaultimg(t){
    //debugger;
  var img=event.srcElement;
  img.src="https://kp.m-team.cc/logo.png";
  img.height=300;
  img.onerror=null;
}</script>`;
    html+=`<div class="container" style="width:auto"><ul id="result1" class="item-list nav" >`;
    const rows=$j("#form_torrent > table > tbody > tr > td.torrenttr > table > tbody > tr ");

    rows.map((idx,row)=>{ html+=dealRow(row);})
    html+=`</ul></div>`;
    return html;
}
function dealRow(row)
{
    const link=row.children[0].children[0].href;
    const img=row.children[0].children[0].children[0].src;
    let chs_name=row.children[1].lastChild.textContent;
    const eng_name=findEngName(row.children[1].children);
    const size=row.parentElement.parentElement.parentElement.parentElement.children[4].textContent;
    const seeds=row.parentElement.parentElement.parentElement.parentElement.children[5].textContent;
    if (chs_name==undefined || chs_name=="")
        chs_name=eng_name;
    const imdb=findIMDB(row.children[2].children);
    const text=`<li><div><div class="pull-left x-movie-mediumimg">
				<div class="imdb_index">${imdb}</div>
		<a data-movie="playmask" class="z-movie-playlink" target="_blank" href="${link}">
			<div >
				<img onerror="defaultimg(this)" alt="${chs_name}" src="${img}" data-bd-imgshare-binded="1">
			</div>
			<div class="z-movie-playmask" style="visibility: visible;"></div>
		</a>
	</div>
	<div class="item-desc pull-left">
		<p style="text-align:center;width:260px;line-height:16px;position: relative;top: 50%;transform: translateY(-50%);"><a target="_blank" href="${link}"><span class="badge" style="background-color:red;"></span>${chs_name}</a> <span style="color:#CF0000">${size}:${seeds}</span></p>
	</div>
</div></li>`;
    return text;
}
function findIMDB(list)
{
    const a=list[list.length-1];
    if (a.tagName=='A')
        return a.outerHTML;
    else
        return "N/A";
}
function findEngName(list)
{
    for(let i=0;i<list.length;i++)
    {
        if (list[i].tagName=='A')
            return list[i].innerText;
    }
    return "Error";
}

function mteam_addStyle (cssStr) {
    var D               = document;
    var newNode         = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ    = D.getElementsByClassName ('torrents')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}
function GM_addScript(s)
{
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'test.js'
    document.body.appendChild(script)
    // 等价
    //document.write("<script src='test' type='text/script'><\/script>")
}
function load_css(css)
{
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = css;
    document.getElementsByTagName("head")[0].appendChild(link)
}
function load_style()
{
    const style=`
.selectul{list-style:none;padding-left:0px;}
.selectul li{clear:both;}
.vip{color:#DAA520;font-style:normal;}
.playcon{height:33px; padding:0px;}
.playname{ list-style:none;float:left;padding-left:0px;margin-bottom:0px;}
.playul{list-style:none;float:right;padding-left:0px;margin-bottom:0px;padding-right:30px;}
.playul li{float:left}
.picon{position:relative;border-bottom:none;top:0;left:0;display:block;padding-left:28px;padding-right:12px;height:32px;line-height:32px;color:#B5B5B5;}
.picon-icon{background:url(../img/icons.png) no-repeat;display:block;width:18px;height:18px;background-position:-4px -4px}
.picon-icon{position:absolute;left:8px;top:6px}.picon .sohu{background-position:-4px -4px}.picon .qq{background-position:-26px -4px}.picon .m1905{background-position:-48px -4px}.picon .iqiyi{background-position:-70px -4px}.picon .mgtv{background-position:-92px -4px}.picon .kankan{background-position:-114px -4px}.picon .other{background-position:-136px -4px}.picon .le{background-position:-158px -4px}.picon .wasu{background-position:-180px -4px}.picon .hd{background-position:-202px -4px}.picon .fun{background-position:-4px -26px}.picon .ku6{background-position:-26px -26px}.picon .pptv{background-position:-48px -26px}.picon .tudou{background-position:-70px -26px}.picon .zhejiang{background-position:-92px -26px}.picon .m56{background-position:-114px -26px}.picon .xiankan{background-position:-136px -26px}.picon .fenghuang{background-position:-158px -26px}.picon .jilang{background-position:-180px -26px}.picon .youku{background-position:-4px -48px}
.select{padding-left:10px;padding-right:40px;}
.dropdown-menu{min-width:120px;}
.selectli{width:120px;}
#videoBox {
 padding:10px;
  height:420px;
}
.playiframe {
  width: 100%;
  height:100%;
  vertical-align:middle;
}
#viewfilm a{color:#37a;}.hidden-ygp,.hidden-live,.hidden-cililian{display:none;}
	.item-list{
	width: auto;
}.img-list-title{font-size: 12px}
p{line-height: 20px;}
.item-list li{
	background: #fff;
	display: block;
	margin-bottom: 20px;
	float: left;
	position: relative;
	height: 365px;
	width: 264px;
}.img-thumbnail {border:0;}
#indeximg {height:200px;}
.item-list img{max-height: 300px;width: 239px;margin-left:6px;vertical-align: middle;}
.img-list{border: 1px solid #ccc;border-top: 0px;}
.img-list img{height: 170px;width: 120px;}
.img-list li{background: #fff;float: left;}
.img-list-title{
	margin: 5px 3px;
	padding: 3px;
	background: rgba(0, 0, 0, 0.6);
	color: #FFF;
	display: block;
	left: 0;
	right: 0;
	position: absolute;
	bottom: 0;
	text-align: center;
}
.item-desc{
	padding-top: 2px;
	max-width: 260px;
	height: 60px;
	overflow-y: hidden;
	font-size:12px;
}
.item-desc .attr{
	font-weight: bold;
	color: #666;
}
#login_wrapper{
    left: 0;
    right: 0;
    top: 20%;
    bottom: 0;
    width: 100%;
    margin: auto;
    z-index: 9999;
    position: fixed;
    _position: absolute;
    text-align: center;
    color: #777;
}
#login_box {
	width: 320px;
	margin: 0 auto;
	padding: 30px 30px 25px;
    text-align: left;
    _zoom: 1;
    max-width: 100%;
    border: 1px solid #aaa;
    background: #fff url("http://static.duoshuo.com/images/bg_sprites.png") 0 -90px repeat-x;
    text-shadow: 0 1px 0 #fff;
    box-shadow: inset 0 1px 1px #fff,0 2px 6px rgba(0,0,0,0.4);
    height: 180px;
    border-radius: 3px;
}
.close_btn {
    position: relative;
    float:right;
    bottom: 26px;
    display: block;
    width: 13px;
    height: 13px;
    overflow: hidden;
    background: transparent url("//static.duoshuo.com/images/sprites.png") 0 -163px no-repeat;
    _background-image: url("//static.duoshuo.com/images/sprites.gif");
}
.tab-pane .nav>li>a {
  padding: 5px 2.8px;
}#tab_link>li {float:right;}
@media (max-width: 1210px){#mainrow{width:990px;margin-left:0;padding: 0;}#sidebar{position: absolute;right:0;top:0;}}
#listselect .current{background-color: #eee;border-radius: 5px}
.yjbjs{width:83px;padding:10px 5px;background-color: #f0f3f5;border-radius:5px}
.navbar-fixed-top, .navbar-fixed-bottom{z-index: 8;}
.bdsug_copy{display:none;}
.imdb_index{background: url("https://gaoqing.fm/static/img/score-bg.png") no-repeat;
  height: 16px;
  width: 35px;
  position: absolute;
  z-index: 2;
  top: 5px;
  left: 6px;
  padding-left:5px;
  color: #fff;
  font-weight: bold;
  text-align: left;
  line-height: 16px;
font-size:12px;}
.sub_index{
  -webkit-transform: rotate(30deg);
-moz-transform: rotate(30deg);
background: url(../img/sub-bg.png) no-repeat;
  height: 16px;
  width: 70px;
  position: absolute;
  z-index: 2;
  top: 3px;
  left: 85px;
  padding-left:5px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  line-height: 16px;
font-size:12px;
}
.rate_view{
background: url(../img/score-bg.png) no-repeat;
  height: 16px;
  width: 35px;
  position: absolute;
  z-index: 2;
  top: 8px;
  left: 3px;
  padding-left:5px;
  color: #fff;
  font-weight: bold;
  text-align: left;
  line-height: 16px;
font-size:12px;
}
.allstar50, .allstar45, .allstar40, .allstar35, .allstar30, .allstar25, .allstar20, .allstar15, .allstar10, .allstar05, .allstar00, .rating1-t, .rating15-t, .rating2-t, .rating25-t, .rating3-t, .rating35-t, .rating4-t, .rating45-t, .rating5-t, .rating-t, .starb ~ .stars5, .starb ~ .stars4, .starb ~ .stars3, .starb ~ .stars2, .starb ~ .stars1, .collectors .stars5, .collectors .stars4, .collectors .stars3, .collectors .stars2, .collectors .stars1 {
    background: rgba(0, 0, 0, 0) url("../img/ic_rating_s.png") no-repeat scroll 0 0;
    display: inline-block;
    height: 11px;
    margin: 0 3px 0 0;
    overflow: hidden;
    width: 55px;
}
.status-item .allstar50, .status-item .allstar45, .status-item .allstar40, .status-item .allstar35, .status-item .allstar30, .status-item .allstar25, .status-item .allstar20, .status-item .allstar15, .status-item .allstar10, .status-item .allstar05, .status-item .allstar00, .status-item .rating1-t, .status-item .rating15-t, .status-item .rating2-t, .status-item .rating25-t, .status-item .rating3-t, .status-item .rating35-t, .status-item .rating4-t, .status-item .rating45-t, .status-item .rating5-t, .status-item .rating-t, .status-item .starb ~ .stars5, .status-item .starb ~ .stars4, .status-item .starb ~ .stars3, .status-item .starb ~ .stars2, .status-item .starb ~ .stars1, .status-item .collectors .stars5, .status-item .collectors .stars4, .status-item .collectors .stars3, .status-item .collectors .stars2, .status-item .collectors .stars1 {
    margin: 0 0 0 4px;
}
.allstar50 {
    background-position: 0 0;
}
.allstar45 {
    background-position: 0 -11px;
}
.allstar40 {
    background-position: 0 -22px;
}
.allstar35 {
    background-position: 0 -33px;
}
.allstar30 {
    background-position: 0 -44px;
}
.allstar25 {
    background-position: 0 -55px;
}
.allstar20 {
    background-position: 0 -66px;
}
.allstar15 {
    background-position: 0 -77px;
}
.allstar10 {
    background-position: 0 -88px;
}
.allstar05 {
    background-position: 0 -99px;
}
.allstar00 {
    background-position: 0 -110px;
}
.rating5-t, .starb ~ .stars5, .collectors .stars5 {
    background-position: 0 0;
}
.rating45-t {
    background-position: 0 -11px;
}
.rating4-t, .starb ~ .stars4, .collectors .stars4 {
    background-position: 0 -22px;
}
.rating35-t {
    background-position: 0 -33px;
}
.rating3-t, .starb ~ .stars3, .collectors .stars3 {
    background-position: 0 -44px;
}
.rating25-t {
    background-position: 0 -55px;
}
.rating2-t, .starb ~ .stars2, .collectors .stars2 {
    background-position: 0 -66px;
}
.rating15-t {
    background-position: 0 -77px;
}
.rating1-t, .starb ~ .stars1, .collectors .stars1 {
    background-position: 0 -88px;
}
.rating1-t, .rating15-t, .rating2-t, .rating25-t, .rating3-t, .rating35-t, .rating4-t, .rating45-t, .rating5-t, .rating-t {
    padding-left: 5px;
}
.suggest-index{position:absolute;width:100%;max-width:475px;z-index:1000;padding:5px 0;font-size:14px;text-align:left;list-style:none;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid rgba(0,0,0,.15);border-radius:2px;-webkit-box-shadow:0 6px 12px rgba(0,0,0,.175);box-shadow:0 6px 12px rgba(0,0,0,.175);border-top-width:0;-webkit-transition:all .3s ease-out;-moz-transition:all .3s ease-out;-o-transition:all .3s ease-out;transition:all .3s ease-out;display:none;left:0;top:28px}
.suggest-index li{color:#777;padding:8px 0 8px 20px;display:block;text-align:left;border-radius:0;margin:-5px 0}

.suggest-index li b{color:red}
.suggest-index #tiny{color:#777;font-size:12px}
.suggest-index #douban{text-align:right;margin-right:6px;padding:0;line-height:12px;margin-top:5px;margin-bottom:2px}
.suggest-index #douban a{font-size:10px}`;
    GM_addStyle(style);
}
