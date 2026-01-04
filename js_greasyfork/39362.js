// ==UserScript==
// @name         Bihu Addons
// @namespace    https://bihu.com/people/112225
// @version      0.4.1
// @description  Bihu Addons(币乎助手)是一个为了增强币乎网站的可用性而推出的一款非常实用的插件。现在具有的功能有：1、草稿自动保存。2、批量取消关注。
// @author       Riley Ge
// @match        https://bihu.com/edit
// @match        https://bihu.com/people/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39362/Bihu%20Addons.user.js
// @updateURL https://update.greasyfork.org/scripts/39362/Bihu%20Addons.meta.js
// ==/UserScript==

(function() {
    // Your code here...
    // add a button to the page and position it in the top left corner
    //var jqCookie = Cookies.noConflict();

    String.prototype.endwith=function(s){
        if(s===null||s===""||this.length===0||s.length>this.length)
            return false;
        if(this.substring(this.length-s.length)==s)
            return true;
        else
            return false;
        return true;
    };

    $(document).ready(function(){
        var address = window.location.href;
        if(address === "https://bihu.com/edit")
        {
            var publishButton = $('button.LoaderButton.edit-ok');
            publishButton.parent().css('width', '50%');
            publishButton.css({"float": "right","display": "inline", "width": "40%"});
            publishButton.before('<input article=0 type="button" value="加载草稿" id="rg_autosave_load">');
            $('#rg_autosave_load').css({"float": "left","display": "inline","width": "40%","height": "40px","border-radius": "2px","border": "none","background": "#007BFF","color": "#ffffff"});

            if(!window.localStorage){
                //不支持localStorage的时候用Cookie来保存数据
                $('#rg_autosave_load').click(function(){
                    $("#title")[0].value = Cookies.get('bihu_title'); // => 'value';
                    $("div.w-e-text").html(decodeURI(Cookies.get('bihu_content')));
                });

                var clks = setInterval(function(){
                    var title = $("#title")[0].value;
                    if(title.length > 0)
                        Cookies.set('bihu_title', title,  { expires: 365 });
                    var content = $("div.w-e-text").html();
                    if(content != "<p><br></p>")
                        Cookies.set('bihu_content', encodeURI(content),  { expires: 365 });
                },5000);
            }else{
                var storage=window.localStorage;
                $('#rg_autosave_load').click(function(){
                    $("#title")[0].value = storage.getItem("bihu_title");
                    $("div.w-e-text").html(decodeURI(storage.getItem('bihu_content')));
                });

                var clks2 = setInterval(function(){
                    var title = $("#title")[0].value;
                    if(title.length > 0)
                        storage.setItem("bihu_title", title);
                    var content = $("div.w-e-text").html();
                    if(content != "<p><br></p>")
                        storage.setItem('bihu_content', encodeURI(content));
                },5000);
            }
        }else{
            var clks3 = setInterval(function(){
                var moreButton = $('button.LoaderButton.load');
                address = window.location.href;
                if(moreButton !== null && address.endwith("index=2"))
                {
                    moreButton.before('<input article=0 type="button" class="load" value="加载超多" id="rg_auto_load_unfollow">');

                    moreButton.before('<input article=0 type="button" class="load" value="取关超多" id="rg_auto_unfollow">');
                    $("#rg_auto_unfollow").css("visibility", "hidden");

                    var count = 1;
                    $('#rg_auto_load_unfollow').click(function(){
                        alert("正在加载，请不要重复点击！");
                        var btn;
                        if(count > 1 && count%10 === 0)
                        {
                            count++;
                            btn=$("button.LoaderButton.load");
                            btn.click();
                        }
                        var clks = setInterval(function(){
                            btn=$("button.LoaderButton.load");
                            if(!btn.is(':visible') || count%10 === 0)
                            {
                                $("#rg_auto_load_unfollow").css("visibility", "hidden");
                                $("#rg_auto_unfollow").css("visibility", "visible");
                                clearInterval(clks);
                                //btn.hide();
                            }else{
                                count++;
                                btn.click();
                            }
                        },8000);
                    });

                    $('#rg_auto_unfollow').click(function(){
                        alert("正在取关，请不要重复点击！");
                        var lis;
                        if(count == 10)
                            lis=$("li.attention-item");//获取类名为attention-item-btn的Button所有标签
                        else
                            lis=$("li.attention-item:gt("+((count-10)*20-1)+")");//获取类名为attention-item-btn的Button所有标签
                        var licount = 0;
                        var clks2 = setInterval(function(){
                            while(true)
                            {
                                var value = lis[licount];
                                if(value === null)
                                {
                                    $("#rg_auto_load_unfollow").css("visibility", "visible");
                                    $("#rg_auto_unfollow").css("visibility", "hidden");
                                    clearInterval(clks2);
                                    break;
                                }
                                if(value.children[0].src === "https://bihu2001.oss-cn-shanghai.aliyuncs.com/img/bihu_user_default_icon.png?x-oss-process=style/size_head" &&
                                   value.children[1].children[0].innerText.substring(0,3) === "币友_")
                                {
                                    value.children[2].click();
                                    licount++;
                                    break;
                                }else
                                {
                                    licount++;
                                    continue;
                                }
                            }
                        },1000*8);
                    });
                }
                clearInterval(clks3);
            }, 2000);
        }
    });
})();