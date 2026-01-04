// ==UserScript==
// @name        追放官方社区电脑版页面调整
// @namespace   GFL2-PC-BBS
// @license     MIT
// @icon        https://community-cdn.exiliumgf.com/prod/image/1727091143918.png
// @match       *://gf2-bbs.sunborngame.com/*
// @match       *://gf2-bbs.exiliumgf.com/*
// @exclude     *://gf2-bbs.sunborngame.com/m/*
// @exclude     *://gf2-bbs.exiliumgf.com/m/*
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_notification
// @version     0.2.10.2
// @author      Mirco
// @description 各种各样的页面调整
// @downloadURL https://update.greasyfork.org/scripts/506560/%E8%BF%BD%E6%94%BE%E5%AE%98%E6%96%B9%E7%A4%BE%E5%8C%BA%E7%94%B5%E8%84%91%E7%89%88%E9%A1%B5%E9%9D%A2%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/506560/%E8%BF%BD%E6%94%BE%E5%AE%98%E6%96%B9%E7%A4%BE%E5%8C%BA%E7%94%B5%E8%84%91%E7%89%88%E9%A1%B5%E9%9D%A2%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==


//----------CSS布局调整----------

function adjust_layout() {
    if (mod_setting.layout.wide == true) {
        GM_addStyle(`

/*-----主页-----*/

.head .head_main{width:95% !important;}

.content{
  width:100% !important;
  max-width:unset !important;
  height:100%;
}

.content .content_main{
	width:${mod_setting.layout.wide_percent}% !important;
	height:89% !important;
}

.content_main .content_m{
  padding:unset !important;
  width:calc(100% - 480px) !important;
}

::-webkit-scrollbar{
  /*display:none;*/
  width:10px;
  height:10px;
}

::-webkit-scrollbar-thumb:hover{
  background-clip: border-box;
}

::-webkit-scrollbar-thumb{
  background-color:#f26c1c;
  border-style: dashed;
  border-radius:10px;
  border-color: transparent;
  border-width: 3px;
  background-clip: padding-box;
}

::-webkit-scrollbar-track{
  background-color:transparent;
  border-radius:10px;
}

.index_con .van-list .card_item{
	width:98% !important;
	cursor:default;
}

.card_item .img_box div{
  display:inline-block;
  margin-right:10px;
}

.card_item .card_m .img_box{display:unset !important}

.swiper-container1{
  width:620px !important;
  margin-left:5px !important;
  display:inline-block;
  float:right;

}

.index_con{margin-top:unset !important}

.message_box>.message_pro{left:-45px !important}

/*.pc_right_bt{z-index:-1}*/

.index_news{
  border-radius:5px !important;
  width:calc(100% - 625px) !important;
  display:inline-block;
  float:left;
}

.index_con>.list_wrap{
  display:inline-block;
  width:calc(100% - 625px);
}

.conditions1{border-radius:5px !important}

.card_item{border-radius:5px !important}

.theme{border-radius:5px !important}


/*-----帖子页-----*/

.content_th{width:100% !important}

.content_main .post_box{
	left:unset !important;
	border-radius:5px !important;
}

.content_main .content_m12{
  left:60px !important;
  width:calc(100% - 300px) !important;
}

.content_m12>.card_item{width:97% !important}

.card_m1>p{
  font-size:0.18rem !important;
  line-height:0.4rem !important;
  font-weight:bold;
}

.card_m1 .showImg{
  max-width:600px;
  max-height:600px;
}

.content_m12>.reply_con1{
	width:calc(100% - 5px) !important;
	border-radius:5px;
}

.reply_con1>.reply_con_child{
  width:unset !important;
  margin:0 20px !important;
  border-radius:20px !important;
}

.content_m12>.comment_head{
  width:calc(100% - 3%) !important;
  border-radius:5px;
}

.content_m12>.van-list{width:100% !important}

.content_m12>.van-list>.card_item{width:97% !important}

.card_con .card_con_reply{
  padding: 0.1rem 0.1rem !important;
  background-color: #eee;
  border-radius:5px;
}

.emoji_box{width:unset !important}

.card_item>.card_t>.card_tm>div{font-size:20px !important}

.content>.van-popup--center:not(.img_popup){
  height:70% !important;
  width:70% !important;
  border-radius:5px !important;
}

.content .reply_con{
  width:unset !important;
  height:95%;
}

.van-popup--center>.reply_con>#div2{height:65%}

/*.page>.content{
  max-width:unset !important;
  padding-bottom:unset !important;
  height:calc(100% - 0.46rem);
}*/

.page>.content>#div1{height:60%}

.van-overlay{backdrop-filter:blur(3px);}

.emoji_types{width:unset !important}

.emoji_box{height:calc(100% - 25%) !important}

.card_m1 iframe{
	width:711px !important;
	height:400px !important;
	border:none;
}

.commen_m_box{
	width:unset !important;
	height:unset !important;
}


/*---帖子发布、编辑页---*/

.content_r:has(.head1){
	top:80px;
	height:unset !important;
	width:${mod_setting.layout.wide_percent}% !important;
}

.content_r .head1{margin-top:unset !important}

.head_r .c_box{left:unset !important;}


/*-----攻略页-----*/

.tab_box>ul{
  left:60px;
  position:fixed;
  width:80% !important;
}

.tab_box>ul>li{
  flex-grow:1;
  text-align:center;
}


/*-----账号信息卡页-----*/

.content_main:has(.mine_b){height:90% !important}

.mine_b>.mine_br{width:0}

.mine_brb>.content_f>.van-list .card_item{width:unset !important}

.mine_b>.mine_bl{flex:none}


/*-----兑换页-----*/

.items{width:unset !important}

.strage_item .score{width:auto !important}

.sign{width:unset !important}

.content:has(.sign){height:unset !important}

/*.task{width:unset !important}*/


/*-----搜索页-----*/

#content_sear{width:calc(100% - 230px)}

#content_sear>.van-list .card_item{
  width:97% !important;
  padding:20px !important;
}


/*-----通知页-----*/

.show_message{
  width:unset !important;
  height:unset !important;
}


/*-----登录页-----*/

.login_content{max-width:unset !important}


/*-----话题页-----*/

#con_m:has(.top_box){width:calc(100% - 230px) !important}

#con_m:has(.top_box) .card_item{width:unset !important}

#con_m>.top_box{width:unset !important}



`);
    }
}

//----------主页滚动图调整----------

function main_page_banner_adjust() {
    if (document.querySelector(".conditions1") != null && document.querySelector("#mod_index_news") == null) {
        let cd1_div = document.querySelector(".conditions1");
        let con_div = document.querySelector(".index_con");
        let sc1 = document.querySelector(".swiper-container1");
        con_div.insertBefore(sc1, cd1_div);
    }
}

//----------明暗模式----------

function custom_color() {
    if (mod_setting.layout.change_color == true) {
        GM_addStyle(`

/*---背景色---*/
html,body,.card_con_reply,.post_box>span,.van-search,.van-popup,.searc_box,.sign_box,.content_l,.hot_words>.fire_items div,.van-list,.content_m,.mine_b>.mine_bl,.mine_b>.mine_br,.content_u>.mask>.head_box,.user_box,.content_m12>.reply_con1>.reply_con_child,.content_m12>.reply_con1>.reply_con_child .w-e-text-container{
  background:${mod_setting.layout.bg_color} !important;
  background-color:${mod_setting.layout.bg_color} !important;
  color:${mod_setting.layout.text_color} !important;
}

/*---前景色---*/
.index_news,.conditions1,.card_item,.van-button--primary,.van-button--plain,.comment_head,.post_box,.van-action-sheet__cancel,.list_wrap li,.btn1,.btn2,.item,.w-e-toolbar,.w-e-text-container,.top_box,.t_box>div,.sign,.task,.content_rule,.gift_user,.van-action-sheet__item,.content .van-cell,.content .head1 select,.van-search__content,.user_box .user_item input,.type_box,.head_item,.van-dialog,.van-button--default,.content_r>.btns:has(.btn),.content_m12>.reply_con1,.message_pro,.hot_words,.icon_box,.get_box,.theme,.emoji_types,.head_r .c_box,.com_item>div,.sear_themesbox>ul{
  background-color:${mod_setting.layout.fore_color} !important;
  background:${mod_setting.layout.fore_color} !important;
}

/*---主要文字---*/
.van-tab,.card_tit p,.card_m1 div,.comment_head>span,.van-action-sheet__cancel,.list_wrap>p,.show_message p,.show_message span,.mine_box p,.item>p,.sign_box>p,.gift_user,.comment_head .ac,.van-field__control,.content .head1 select,.card_con_reply p>i>i,.mine_box .data_box span,.van-button--default,.btns span{color:${mod_setting.layout.text_color} !important}

.sign_box>p b{color:#ff0 !important}

.sign_box,.content,.nav2,.nav2 .van-tabs,.nav2 .van-tabs__nav{background:unset !important}

.card_m1 div a,.show_message a{color:#999 !important}

.message .me_con,.message_item>p,.content_l .nav_item:not(.nav_item_c),.content_l ul li:not(.li_c),.content_r .btn,.index_con .strage_item>div span{color:unset !important}

.video_box input,.sear_themesbox input{color:initial !important}

.card_item,.post_box,.comment_head,.btn1,.btn2,.top_box,.sign,.task,.content .van-field,.content #div1,#div2,.type_box,.head_item{-webkit-box-shadow:unset !important}

.pc_right_bt a,.pc_right_bt div{color:${mod_setting.layout.bg_color} !important}

.van-dialog__confirm{color:#e02 !important}

.img_popup{background-color:transparent !important}

.login_box input{color:#000 !important}

::-webkit-scrollbar-thumb{background-color:${mod_setting.layout.text_color}}

`);
    }
}

//----------自定义背景----------

function set_bg_img() {
    if (mod_setting.bg.change) {
        let temp_url = "";
        if (mod_setting.bg.local == true) {
            temp_url = mod_setting.bg.b64;
        } else {
            temp_url = mod_setting.bg.url;
        }
        if (temp_url == "") {
            return;
        }
        GM_addStyle(`

html{
  background:url(${temp_url}) !important;
  background-attachment: fixed !important;
  background-size: cover !important;
}
body,.content_l,.content_r,.content_m{background-color:unset !important}
.content_l,.van-list,.index_con{
  background:unset !important;
  background-image:unset !important;
}
body{
  background:unset !important;
  backdrop-filter:blur(3px);
}
.main,.van-button,.post_box{opacity:${mod_setting.bg.opacity / 100}}
/*.index_con img,.card_item img{opacity:1}*/
/*.message_item,.strage_item{background:#4444}*/
/*.message .me_con,.message_item>p,.content_l .nav_item:not(.nav_item_c),.content_l ul li:not(.li_c),.content_r .btn,.index_con .strage_item>div span{color:unset !important}*/
`);
        if (mod_setting.layout.change_color == true) {
            GM_addStyle(`
				.content_main>.content_l,#hide_reply_input,.message_item,.strage_item,.van-tabs{
					filter:drop-shadow(0 0 5px ${mod_setting.layout.text_color});
					text-shadow:0 0 10px ${mod_setting.layout.text_color};
				}
			`);
        } else {
            GM_addStyle(`
				.content_main>.content_l,#hide_reply_input,.message_item,.strage_item,.van-tabs{
					filter:drop-shadow(0 0 5px #fffe);
					text-shadow:0 0 10px #fffe;
				}
				.message .me_con,.message_item>p,.content_l .nav_item:not(.nav_item_c),.content_l ul li:not(.li_c),.content_r .btn
				,.index_con .strage_item>div span{color:unset !important}
			`);
        }
        if (mod_setting.bg.bg_mode == "brightness") {
            GM_addStyle(`body{backdrop-filter:brightness(0.35);}`);
        } else {
            GM_addStyle(`body{backdrop-filter:blur(3px);}`);
        }
    }
}

//----------隐藏帖子页回复框按钮----------

function add_hide_reply_btn() {
    if (document.querySelector(".reply_con1") != null && document.querySelector("#hide_reply_input") == null) {
        let temp_div = document.querySelector(".reply_con1");
        let temp_btn = document.createElement("button");
        temp_btn.id = "hide_reply_input";
        temp_btn.innerHTML = "隐藏输入框";
        temp_btn.style = `height:25px;width:100%;font-size:15px;border:0;background-color:unset;cursor:pointer;display:block;`;
        temp_btn.addEventListener("click", function () {
            if (temp_div.style.display != "none") {
                temp_div.style.display = "none";
                temp_btn.innerHTML = "显示输入框";
            } else {
                temp_div.style.display = "block";
                temp_btn.innerHTML = "隐藏输入框";
            }
        });
        temp_div.parentElement.insertBefore(temp_btn, temp_div /*.nextSibling*/);
        document.querySelector("#hide_reply_input")?.click();
        GM_addStyle(`.content_m12>.reply_con1{margin:0 auto !important}`);
    }
}

//----------隐藏帖子页右边边栏----------

function hide_content_r_in_post() {
    if (document.querySelector(".content_r").style.display != "none") {
        document.querySelector(".content_r").style.display = "none";
        document.querySelector(".content_m12").style = "width:calc(100% - 60px) !important";
    }
}

//----------帖子内点击图片查看附加功能----------

function add_img_pop_btns() {
    let popup_div = document.querySelector(".img_popup");
    if (popup_div != null && document.querySelector("#mod_img_pop_div") == null) {
        let temp_div = document.createElement("div");
        temp_div.id = "mod_img_pop_div";
        let temp_button1 = document.createElement("button");
        let temp_button2 = document.createElement("button");
        temp_button1.id = "mod_big_img";
        temp_button1.innerHTML = "长图片模式";
        temp_button2.innerHTML = "设为背景图";
        temp_button1.addEventListener("click", function () {
            let imgs = document.querySelectorAll(".img_popup img");
            imgs.forEach(function (img) {
                if (img.style.maxHeight == "") {
                    img.style = "max-height:unset;position:absolute;top:10px;";
                } else {
                    img.style = "";
                }
            });
        });
        temp_button2.addEventListener("click", function () {
            mod_setting.bg.url = document.querySelector(".img_popup .swiper-slide-active img").src;
            mod_setting.bg.change = true;
            mod_setting.bg.local = false;
            save_setting();
            GM_notification("设置成功，点此刷新页面后生效！", "设置背景图", "https://community.cdn.sunborngame.com/prod/image/1727091143918.png", function () {
                location.reload();
            });
        });
        temp_div.appendChild(temp_button1);
        temp_div.appendChild(temp_button2);
        popup_div.appendChild(temp_div);

        GM_addStyle(`
			#mod_img_pop_div{
				position:fixed;
				top:10px;
				right:50px;
				width:200px;
				height:50px;
				/*background-color:#fff;*/
				z-index:2100;
				opacity:0.5;
				font-size:15px;
			}
			#mod_img_pop_div input{-webkit-appearance:auto}
			#mod_img_pop_div label{color:#eee}
			#mod_img_pop_div button{color:#eee;background:transparent;margin-left:15px;border:0;cursor:pointer;}
	`);
    }
}

//----------贴内回复自动切换成最新/最早----------

function reply_early_seq() {
    let temp_var
    if (mod_setting.post.seq == 2) {
        temp_var = 2;
    } else if (mod_setting.post.seq == 1) {
        temp_var = 1;
    }
    if (document.querySelectorAll(".comment_head div:not(.comment_head_l) span")[temp_var] != null) {
        document.querySelectorAll(".comment_head div:not(.comment_head_l) span")[temp_var].click();
    }
}

//----------设置帖子页面的标题----------

function set_post_page_title() {
    let t_title = document.querySelector(".card_m1>p").innerText;
    if (document.title.startsWith(t_title) == false) {
        document.title = t_title + " - " + document.title;
    }
}

//----------首页中查看大图----------

function big_pic_for_main_page() {
    document.querySelectorAll(".img_box img").forEach(function (img) {
        if (img.classList.contains("clickimg") == false) {
            img.style.cursor = "zoom-in";
			img.parentElement.style.maxWidth = "2rem";
            img.addEventListener("click", function (event) {
                event.stopPropagation();
                if (this.style.maxHeight == "") {
                    this.parentElement.style.height = "unset";
					this.parentElement.style.maxWidth = "";
                    this.style.maxHeight = "700px";
                    this.style.cursor = "zoom-out";
                } else {
                    this.parentElement.style.height = "";
					this.parentElement.style.maxWidth = "2rem";
                    this.style.maxHeight = "";
                    this.style.cursor = "zoom-in";
                    this.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            });
            img.classList.add("clickimg");
        }
    });
}

//----------信息页游戏角色查询入口----------

function add_game_profile() {
    if (document.querySelector(".mine_box_r") != null) {
        if (document.querySelector("#mod_game_profile") == null) {
            let ent = document.createElement("a");
            ent.id = "mod_game_profile";
            ent.innerText = "游戏角色查询";
            if (document.location.pathname.startsWith('/own')) {
                ent.href = "../m/userData";
            } else {
                ent.href = `../m/otherData${document.location.search}`;
            }
            ent.target = "_blank";
            document.querySelector(".mine_box_r").appendChild(ent);
            GM_addStyle(`
			#mod_game_profile{
				font-size:14px;
				display:block;
				text-align:center;
				color:#fff;
			}
			`);
        }
    }
}

//----------帖内回复图片缩放----------

function post_reply_small_img() {
    document.querySelectorAll("#con_m>.van-list .showImg,.commen_m_box .showImg").forEach(function (img) {
        if (img.getAttribute("mod_img") != "1" && img.naturalHeight > 300) {
            img.style.maxHeight = "300px";
            if (mod_setting.post.reply_scale_img) {
                img.style.cursor = "zoom-in";
                img.addEventListener("click", function (event) {
                    event.stopImmediatePropagation();
                    if (img.style.maxHeight == "") {
                        img.style.maxHeight = "300px";
                        img.style.cursor = "zoom-in";
                        img.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    } else {
                        img.style.maxHeight = "";
                        img.style.cursor = "zoom-out";
                    }
                });
            }
            img.setAttribute("mod_img", "1");
        }
    });
}

//----------贴内添加滚动到顶端按钮----------

function post_scroll_top() {
	let temp_btn = document.createElement("button");
	let post_div = document.querySelector("#con_m");
	temp_btn.id = "mod_scroll_top";
	temp_btn.innerHTML = "↑<br>TOP";
	temp_btn.title = "回到帖子顶端";
	if (mod_setting.layout.change_color == false) {
		temp_btn.style.color = "#f26c1c";
	}
	if (document.querySelector("#mod_scroll_top") == null) {
		post_div?.appendChild(temp_btn);
	}
	temp_btn.addEventListener("click", function () {
		post_div.scrollTo({top:0,behavior:"smooth"});
	});
	post_div.addEventListener("scroll", function (){
		if (post_div.scrollTop >= 700) {
			temp_btn.style.visibility = "visible";
		}else{
			temp_btn.style.visibility = "hidden";
		}
	});
	GM_addStyle(`
	#mod_scroll_top {
		background-color : unset;
		border-width : 0;
		cursor : pointer;
		position : fixed;
		right : 20px;
		bottom : 50px;
		visibility : hidden;
		font-weight : bold;
	}
	`)
}

//----------脚本设置面板----------

function add_plugin_setting_page() {
    if (document.querySelector("#mod_setting_btn") == null || document.querySelector("#mod_setting_panel") == null) {
        let temp_btn = document.createElement("button");
        temp_btn.id = "mod_setting_btn";
        temp_btn.innerHTML = `<img src="${setting_icon}">`;
        temp_btn.title = "页面调整设置";
        let mod_div = document.createElement("div");
        mod_div.id = "mod_setting_panel";
        mod_div.style.display = "none";
        mod_div.classList.add("van-popup");
        mod_div.classList.add("van-popup--center");
        mod_div.innerHTML = setting_page;
        if (document.querySelector("#mod_setting_btn") == null) {
            document.querySelector(".main")?.appendChild(temp_btn);
        }
        temp_btn.addEventListener("click", function () {
            if (mod_div.style.display == "none") {
                mod_div.querySelectorAll("fieldset[name]").forEach(function (item_set) {
                    item_set.querySelectorAll("input[name]").forEach(function (item) {
                        if (item.type == "checkbox") {
                            item.checked = mod_setting[item_set.name][item.name];
                        } else if (item.type == "radio") {
                            if (item.value == mod_setting[item_set.name][item.name]) {
                                item.checked = true
                            }
                        } else {
                            item.value = mod_setting[item_set.name][item.name];
                        }
                        var event = new Event('input', {
                            bubbles: true
                        });
                        item.dispatchEvent(event);
                    });
                });
                mod_div.querySelector("#mod_set_img").src = mod_div.querySelector('input[name=\"b64"]').value;
                mod_div.style.display = "unset";
            }
        });
        if (document.querySelector("#mod_setting_panel") == null) {
            document.body.appendChild(mod_div);
            mod_div.querySelector("#mod_set_p_cancel").addEventListener("click", function () {
                mod_div.style.display = "none";
                mod_div.querySelector("#mod_set_imgsize").innerText = "";
            });
            mod_div.querySelector("#mod_set_p_ok").addEventListener("click", function () {
                mod_div.querySelectorAll("fieldset[name]").forEach(function (item_set) {
                    item_set.querySelectorAll("input[name]").forEach(function (item) {
                        if (item.type == "checkbox") {
                            mod_setting[item_set.name][item.name] = item.checked;
                        } else if (item.type == "radio") {
                            if (item.checked == true) {
                                mod_setting[item_set.name][item.name] = item.value
                            }
                        } else {
                            mod_setting[item_set.name][item.name] = item.value;
                        }
                    });
                });
                save_setting();
                location.reload();
            });
            mod_div.querySelector("#mod_set_p_loadbg").addEventListener("click", function () {
                let temp_bgfile = document.createElement("input");
                temp_bgfile.type = "file";
                temp_bgfile.accept = "image/*";
                temp_bgfile.addEventListener("change", function () {
                    if (temp_bgfile.files[0]?.type.startsWith("image/")) {
                        let reader = new FileReader();
                        reader.onload = function () {
                            mod_div.querySelector('fieldset[name="bg"] input[name="b64"]').value = reader.result;
                            mod_div.querySelector("#mod_set_img").src = reader.result;
                        };
                        reader.readAsDataURL(temp_bgfile.files[0]);
                    }
                });
                temp_bgfile.click();
            });
            mod_div.querySelector("#mod_set_img").addEventListener("click", function (sender) {
                this.src = "";
                mod_div.querySelector('fieldset[name="bg"] input[name="b64"]').value = "";
                mod_div.querySelector("#mod_set_imgsize").innerText = "";
            });
            mod_div.querySelector("#mod_set_img").onload = function () {
                mod_div.querySelector("#mod_set_imgsize").innerText = `${mod_div.querySelector("#mod_set_img").naturalWidth} × ${mod_div.querySelector("#mod_set_img").naturalHeight}`;
                mod_div.querySelector("#mod_set_p_loadbg").style.display = "none";
            };
            mod_div.querySelector("#mod_set_img").onerror = function () {
                mod_div.querySelector("#mod_set_p_loadbg").style.display = "block";
            };
            mod_div.querySelector("#mod_set_p_resetcolor").addEventListener("click", function () {
                mod_div.querySelector('fieldset[name="layout"] input[name="bg_color"]').value = "#444444";
                mod_div.querySelector('fieldset[name="layout"] input[name="fore_color"]').value = "#333333";
                mod_div.querySelector('fieldset[name="layout"] input[name="text_color"]').value = "#eeeeee";
            });
            mod_div.querySelector('fieldset[name="layout"] input[name="wide_percent"]').addEventListener("input", function () {
                mod_div.querySelector("#mod_set_w_value").innerText = this.value + "% 宽度";
            });
			mod_div.querySelector('fieldset[name="bg"] input[name="opacity"]').addEventListener("input", function () {
                mod_div.querySelector("#mod_set_o_value").innerText = this.value + "%";
            });
        }
    }
}

const setting_page = `
<span>页面调整设置</span>
<button id="mod_set_p_cancel">×</button>
<br>
<div>
  <fieldset name="layout" style="display:flex;flex-direction:column;">
    <legend>布局与颜色</legend>
    <label><input type="checkbox" name="wide">宽屏布局 <input type="range" name="wide_percent" min="70" max="100" step="0.2"><span id="mod_set_w_value"></span></label>
	<label><input type="checkbox" name="main_bigpic">主页图片点击放大</label>
    <label><input type="checkbox" name="change_color">自定义颜色</label>
	<div style="display:flex">
	<label>背景<input type="color" name="bg_color"></label>
	<label>前景<input type="color" name="fore_color"></label>
	<label>主要文字<input type="color" name="text_color"></label>
	</div>
	<button id="mod_set_p_resetcolor">设置颜色为暗色模式</button>
  </fieldset>
  <fieldset name="post">
    <legend>帖子页面</legend>
    <label><input type="checkbox" name="hide_input">自动隐藏回复输入框</label>
	<label><input type="checkbox" name="scroll_top">添加滚动到页面顶端按钮</label>
	<label><input type="checkbox" name="img_btns">查看大图界面添加长图放大、设为背景功能</label>
	<label><input type="checkbox" name="reply_small_img">缩小回复显示的图片(<label><input type="checkbox" name="reply_scale_img">原地放大</label>)</label>
	<label><input type="checkbox" name="hide_cont_r">隐藏右侧边栏</label>
	<label><input type="checkbox" name="post_title_as_page_title">将帖子标题添加到网页的标题前</label>
    <div style="display:flex">
	回复以
	<label><input type="radio" name="seq" value="2">最新</label>
	<label><input type="radio" name="seq" value="1">最早</label>
	<label><input type="radio" name="seq" value="0">默认</label>
	顺序显示
	</div>
  </fieldset>
</div>
<div>
  <fieldset name="userpage">
    <legend>账号信息页</legend>
	<label><input type="checkbox" name="add_game_profile">添加游戏角色查询入口</label>
  </fieldset>
  <fieldset name="bg" style="display:flex;flex-direction: column;">
    <legend><label><input type="checkbox" name="change">背景图片</label></legend>
	<div>
	<label>界面元素不透明度：<input type="range" name="opacity" min="50" max="100" step="1"><span id="mod_set_o_value"></span></label>
	背景图片处理：
	<label style="display:inline-block"><input type="radio" name="bg_mode" value="blur">模糊</label>
	<label style="display:inline-block"><input type="radio" name="bg_mode" value="brightness">降低亮度</label>
	</div>
    <label>图片地址<input type="search" name="url"></label>
    <p>注意：地址需允许外链或者是社区内的图片</p>
    <label><input type="checkbox" name="local">使用本地图片<input type="hidden" name="b64"></label>
	<button id="mod_set_p_loadbg">加载本地图片</button>
    <img id="mod_set_img" title="点击取消加载">
	<span id="mod_set_imgsize"></span>
  </fieldset>
</div>
<div style="display:block">
  <button id="mod_set_p_ok">保存设置并刷新页面</button>
  <span>脚本加载器: ${GM_info.scriptHandler} ${GM_info.version}&nbsp<a href="../m" target="_blank">旧版页面>></a>&nbsp<a href="../threadInfo?id=25991" target="_blank">问题反馈>></a></span><br>
  <span>Ver.${GM_info.script.version} - Code by <a href="../user?id=25395" target="_blank">Mirco</a></span>
</div>

`;

GM_addStyle(`

#mod_setting_btn{
  z-index:1900;
  border:0;
  width:25px;
  height:25px;
  background-color:transparent;
  color:#444;
  display:block;
  font-size:15px;
  position:fixed;
  top:20px;
  right:10px;
  cursor:pointer;
  transition:all 0.5s;
}

#mod_setting_btn:hover{filter: drop-shadow(0px 0px 6px #fff)}

#mod_setting_panel{
  position:fixed;
  font-size:15px;
  padding:15px 25px;
  z-index:1901;
  border:1px #ddd6;
  border-style:solid;
  border-radius:5px;
  box-shadow:0 0 15px #ccc6;
  background-color:#ddda !important;
  backdrop-filter:blur(15px);
  text-shadow: 0 0 20px #999;
  backdrop-filter:blur(10px);
}

#mod_setting_panel>span{
	position:fixed;
	top:1px;
	left:15px;
	cursor:default;
}

#mod_setting_panel input{
  -webkit-appearance:auto;
  margin:0 5px;
}

#mod_setting_panel input[type="number"]{
  width:50px;
  color:#000;
  text-align:center;
}

#mod_setting_panel>div{
  display:inline-block;
  vertical-align:top;
  /*flex-direction: column;*/
}

#mod_setting_panel label{display:flex}

#mod_setting_panel>div input[name="url"]{
  flex-grow:1;
  border:1px #000;
  color:#000;
  border-style:solid;
}

#mod_setting_panel>div>#mod_set_p_ok{
	margin:10px 0;
	float:right;
}

#mod_setting_panel>div button{
  background-color:#ddd;
  color:#000;
  padding:0 5px;
  margin:5px 0 5px;
  cursor:pointer;
  border:1px #777;
  border-radius:3px;
}

#mod_setting_panel>#mod_set_p_cancel{
  position:fixed;
  top:0px;
  right:0px;
  cursor:pointer;
  background-color:#F26C1C55;
  border:0;
  width:50px;
  font-size:15px;
  transition:all 0.5s;
}

#mod_setting_panel>#mod_set_p_cancel:hover{
	background:linear-gradient(to bottom,#F26C1C 0%,#faa 70%,#F26C1C 100%);
	box-shadow:0 0 10px #F26C1C;
}

#mod_setting_panel>div>span{
  text-align:center;
  font-size:10px;
  cursor:default;
}

#mod_setting_panel>div span>a,#mod_setting_panel>div span>a:visited{color:#222;}

#mod_setting_panel fieldset{
  padding:5px 10px;
  border:1px solid;
  margin:5px 0;
  border-radius:5px;
  background-color:#bbba;
}

#mod_setting_panel #mod_set_img{
  max-height:100px;
  max-width:280px;
  display:block;
  margin:0 auto;
  cursor:pointer;
}

#mod_setting_panel #mod_set_img[src=""]{
  display:none;
}

#mod_setting_panel #mod_set_imgsize{
	text-align: center;
    margin: 0 auto;
    display: block;
}

`);

//----------其他功能性函数----------

function waitForObj(selector, callback, active_once = false, node = document.body, stree = true) {
    // 支持传入单个选择器和回调函数
    if (typeof selector === 'string') {
        const obvser = new MutationObserver(function () {
            //console.log("dom updated");
            if (node.querySelectorAll(selector).length > 0) {
                //console.log(`found: ${selector}`);
                callback(obvser);
                if (active_once == true) {
                    obvser.disconnect();
                }
            }
        });
        obvser.observe(document.body, {
            childList: true,
            subtree: stree
        });
        return obvser;
    }

    // 支持传入多个元素监听配置
    // selector格式: [{selector: '.class', callback: func, active_once: true}, ...]
    if (Array.isArray(selector)) {
        const obvser = new MutationObserver(function () {
            //console.log("dom updated");
            selector.forEach(item => {
                if (node.querySelectorAll(item.selector).length > 0) {
                    //console.log(`found: ${item.selector}`);
                    item.callback(obvser);
                    if (item.active_once === true) {
                        // 如果设置了active_once，则从监听列表中移除该项
                        selector = selector.filter(s => s !== item);
                        // 如果监听列表为空，则断开观察器
                        if (selector.length === 0) {
                            obvser.disconnect();
                        }
                    }
                }
            });
        });
        obvser.observe(document.body, {
            childList: true,
            subtree: stree
        });
        return obvser;
    }
}

function waitForObjs() {
    // 创建监听配置数组
    const listeners = [];

    // 添加需要监听的元素和对应的回调函数
    if (mod_setting.post.hide_input) {
        listeners.push({
            selector: ".reply_con1",
            callback: add_hide_reply_btn,
            active_once: false
        });
    }
    if (mod_setting.post.hide_cont_r) {
        listeners.push({
            selector: ".reply_con1",
            callback: hide_content_r_in_post,
            active_once: false
        });
    }
    if (mod_setting.post.img_btns) {
        listeners.push({
            selector: ".img_popup",
            callback: add_img_pop_btns,
            active_once: false
        });
    }
    if (mod_setting.post.seq != 0) {
        listeners.push({
            selector: ".van-list .card_item",
            callback: reply_early_seq,
            active_once: true
        });
    }
    if (mod_setting.layout.wide) {
        listeners.push({
            selector: ".conditions1",
            callback: main_page_banner_adjust,
            active_once: true
        });
    }
    if (mod_setting.layout.main_bigpic) {
        GM_addStyle(`.card_item .card_m .img_box{display:unset !important}`);
        listeners.push({
            selector: ".img_box img",
            callback: big_pic_for_main_page,
            active_once: false
        });
    }
    if (mod_setting.userpage.add_game_profile) {
        listeners.push({
            selector: ".mine_box_r",
            callback: add_game_profile,
            active_once: false
        });
    }
    if (mod_setting.post.reply_small_img) {
        listeners.push({
            selector: "#con_m>.van-list .showImg,.commen_m_box .showImg",
            callback: post_reply_small_img,
            active_once: false
        });
    }
    if (mod_setting.post.post_title_as_page_title) {
        listeners.push({
            selector: ".card_m1>p",
            callback: set_post_page_title,
            active_once: false
        });
    }
	if (mod_setting.post.scroll_top) {
        listeners.push({
            selector: ".card_m1",
            callback: post_scroll_top,
            active_once: true
        });
    }
    listeners.push({
        selector: ".main",
        callback: add_plugin_setting_page,
        active_once: true
    });

    // 使用新的waitForObj函数一次性监听所有元素
    if (listeners.length > 0) {
        waitForObj(listeners);
    }
}

const mod_setting_default = {
    "layout": {
        "wide": false,
        "wide_percent": 99,
        "change_color": false,
        "bg_color": "#444444",
        "fore_color": "#333333",
        "text_color": "#eeeeee",
        "main_bigpic": false
    },
    "bg": {
        "change": false,
        "opacity": 98,
        "local": false,
        "url": "",
        "b64": "",
        "bg_mode": "blur"
    },
    "post": {
        "hide_input": false,
        "seq": 0,
        "img_btns": false,
        "hide_cont_r": false,
        "reply_small_img": false,
        "reply_scale_img": false,
        "post_title_as_page_title": false,
        "scroll_top": false
    },
    "userpage": {
        "add_game_profile": false
    }
};

var mod_setting;

function save_setting() {
    GM_setValue("settings", mod_setting);
}

function load_setting() {
    mod_setting = GM_getValue("settings", mod_setting_default);
    for (let attr_set in mod_setting_default) {
        if (!mod_setting[attr_set]) {
            mod_setting[attr_set] = mod_setting_default[attr_set];
            continue;
        }
        for (let attr in mod_setting_default[attr_set]) {
            if (!mod_setting[attr_set][attr]) {
                mod_setting[attr_set][attr] = mod_setting_default[attr_set][attr];
            }
        }
    }
}

(function () {
    'use strict';

    load_setting();
    //console.log(mod_setting);

    adjust_layout();
    custom_color();
    set_bg_img();
    waitForObjs();

})();

var setting_icon = `data:image/svg+xml;base64,PHN2ZyBkYXRhLXYtYzFhZmFhNDU9IiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjUiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgY2xhc3M9InN2ZyI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZWVlIiBzdHJva2Utd2lkdGg9IjEuNSI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIvPjxwYXRoIGQ9Ik0xMy43NjUgMi4xNTJDMTMuMzk4IDIgMTIuOTMyIDIgMTIgMmMtLjkzMiAwLTEuMzk4IDAtMS43NjUuMTUyYTIgMiAwIDAgMC0xLjA4MyAxLjA4M2MtLjA5Mi4yMjMtLjEyOS40ODQtLjE0My44NjNhMS42MTcgMS42MTcgMCAwIDEtLjc5IDEuMzUzYTEuNjE3IDEuNjE3IDAgMCAxLTEuNTY3LjAwOGMtLjMzNi0uMTc4LS41NzktLjI3Ni0uODItLjMwOGEyIDIgMCAwIDAtMS40NzguMzk2QzQuMDQgNS43OSAzLjgwNiA2LjE5MyAzLjM0IDdjLS40NjYuODA3LS43IDEuMjEtLjc1MSAxLjYwNWEyIDIgMCAwIDAgLjM5NiAxLjQ3OWMuMTQ4LjE5Mi4zNTUuMzUzLjY3Ni41NTVjLjQ3My4yOTcuNzc3LjgwMy43NzcgMS4zNjFjMCAuNTU4LS4zMDQgMS4wNjQtLjc3NyAxLjM2Yy0uMzIxLjIwMy0uNTI5LjM2NC0uNjc2LjU1NmEyIDIgMCAwIDAtLjM5NiAxLjQ3OWMuMDUyLjM5NC4yODUuNzk4Ljc1IDEuNjA1Yy40NjcuODA3LjcgMS4yMSAxLjAxNSAxLjQ1M2EyIDIgMCAwIDAgMS40NzkuMzk2Yy4yNC0uMDMyLjQ4My0uMTMuODE5LS4zMDhhMS42MTcgMS42MTcgMCAwIDEgMS41NjcuMDA4Yy40ODMuMjguNzcuNzk1Ljc5IDEuMzUzYy4wMTQuMzguMDUuNjQuMTQzLjg2M2EyIDIgMCAwIDAgMS4wODMgMS4wODNDMTAuNjAyIDIyIDExLjA2OCAyMiAxMiAyMmMuOTMyIDAgMS4zOTggMCAxLjc2NS0uMTUyYTIgMiAwIDAgMCAxLjA4My0xLjA4M2MuMDkyLS4yMjMuMTI5LS40ODMuMTQzLS44NjNjLjAyLS41NTguMzA3LTEuMDc0Ljc5LTEuMzUzYTEuNjE3IDEuNjE3IDAgMCAxIDEuNTY3LS4wMDhjLjMzNi4xNzguNTc5LjI3Ni44MTkuMzA4YTIgMiAwIDAgMCAxLjQ3OS0uMzk2Yy4zMTUtLjI0Mi41NDgtLjY0NiAxLjAxNC0xLjQ1M2MuNDY2LS44MDcuNy0xLjIxLjc1MS0xLjYwNWEyIDIgMCAwIDAtLjM5Ni0xLjQ3OWMtLjE0OC0uMTkyLS4zNTUtLjM1My0uNjc2LS41NTVBMS42MTcgMS42MTcgMCAwIDEgMTkuNTYyIDEyYzAtLjU1OC4zMDQtMS4wNjQuNzc3LTEuMzZjLjMyMS0uMjAzLjUyOS0uMzY0LjY3Ni0uNTU2YTIgMiAwIDAgMCAuMzk2LTEuNDc5Yy0uMDUyLS4zOTQtLjI4NS0uNzk4LS43NS0xLjYwNWMtLjQ2Ny0uODA3LS43LTEuMjEtMS4wMTUtMS40NTNhMiAyIDAgMCAwLTEuNDc5LS4zOTZjLS4yNC4wMzItLjQ4My4xMy0uODIuMzA4YTEuNjE3IDEuNjE3IDAgMCAxLTEuNTY2LS4wMDhhMS42MTcgMS42MTcgMCAwIDEtLjc5LTEuMzUzYy0uMDE0LS4zOC0uMDUtLjY0LS4xNDMtLjg2M2EyIDIgMCAwIDAtMS4wODMtMS4wODNaIi8+PC9nPjwvc3ZnPg==`;
