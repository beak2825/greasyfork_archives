// ==UserScript==
// @name         facebook_spider_m_v5
// @namespace    http://tampermonkey.net/
// @version      0.05.070419
// @description  facebook collection Tool
// @author       You
// @match        m.facebook.com/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @downloadURL https://update.greasyfork.org/scripts/469854/facebook_spider_m_v5.user.js
// @updateURL https://update.greasyfork.org/scripts/469854/facebook_spider_m_v5.meta.js
// ==/UserScript==
window.devicePixelRatio = 3
$(function () {
    let baseUrl = 'https://app.tigercv.cc/v1_0';
    let targetUrl = 'm.facebook.com';
    let mainDomain = 'facebook.com';
    let userId = getCookie('c_user') ? getCookie('c_user') : getCookie('m_page_voice');

    console.log('启动[Start]')

    window.onscroll = function() {
        console.log('滚动[Scroll]')
        //console.log('>footer', $("[data-store$='}'][data-ft$='}'] >footer"))

        $.each($("[data-store$='}'][data-ft$='}'] >div >footer"), function(i, item){c0(i, item, 2)});
        $.each($("[data-store$='}'][data-ft$='}'] >footer"), function(i, item){c0(i, item, 1)});
    }

     var c0 = function(i, item, n) {
         try{
			let username = '',
				publisher_id = '',
				permalinkid = '',
				updatetime = '',
				groupsId = '',
				groupsName = '',
				publishtime = '',
				source_url = '',
				publisher_link = '',
				publisher_avatar = '',
				publisher_profpic = '';

            let self = '';
			if(n == 2) self = $($($(item).parent().eq(0)).parent().eq(0)).eq(0);
            if(n == 1) self = $($(item).parent().eq(0)).eq(0);

			if ($(self).attr('data-ft')) {
				let ft = $.parseJSON($(self).attr('data-ft'))
				//console.log("---====data-ft===---", ft);
				if (ft) {
					groupsId = ft.page_id
					//console.log('groupsId===========>', groupsId)
                    if (!groupsId) {
						return
					}
					permalinkid = ft.top_level_post_id
					publisher_id = ft.content_owner_id_new

					if (Object.hasOwn(ft, 'page_insights')) {
						$.each(ft.page_insights, function(i, item) {
							if (groupsId == i && item.post_context) {
								publishtime = item.post_context.publish_time
							}

							if (publisher_id == i && item.post_context) {
								publishtime = item.post_context.publish_time
							}
						})
					} else {
						return
					}
					publisher_avatar = $(self).find('i').filter('[role="img"]').eq(0).attr('style').split(
							'url(\'')[1].split('\')')[0].replace(/\\3a\s/gi, ":").replace(/\\3d\s/gi, "=")
						.replace(/\\26\s/gi, "&");
					//console.log(publisher_avatar);
                    if($($(self).find('strong')[0]).find('a').attr('href').indexOf(mainDomain) !== -1) {
                        publisher_link = $($(self).find('strong')[0]).find('a').attr('href')
                    } else {
                        publisher_link = 'https://' + targetUrl + $($(self).find('strong')[0]).find('a').attr('href')
                    }
					//publisher_link = $($(self).find('strong')[0]).find('a').attr('href')
					username = $($(self).find('strong')[0]).find('a').text()
					groupsName = $($(self).find('strong')[1]).find('a').text()
					let children = $($(item).parent()).find('div.story_body_container')
					updatetime = $($(self).find('abbr')[0]).text()

					if ($($(self).find('abbr')[0]).parent().attr('href')) {
						if ($($(self).find('abbr')[0]).parent().attr('href').indexOf(mainDomain) !== -1) {
							source_url = $($(self).find('abbr')[0]).parent().attr('href');
						} else {
							source_url = 'https://' + targetUrl + $($(self).find('abbr')[0]).parent().attr(
								'href');
						}
					}

					let children_1 = $($(children.children())[1])
                    let children_2 = $($(children.children())[2])
                    let quote = 0
                    let content = children_1
                    if (children_2.find('header').length >= 1) {
                        quote = 1
                        content = children_2
                    }

                    //console.log('content=======>', content)
                    /*
                    let content = $({
                        ...$($($(children[0]).children())[1]),
                        ...$($($(children[0]).children())[2])
                    })
                    */

                    if (content.find('[class="text_exposed_hide"]').length >= 1) content.find('[class="text_exposed_hide"]').remove()

					let imglist = [];
					let imgSrc = $(children[0]).children()
					imgSrc = $(imgSrc[2])
					let imgs = imgSrc.find('[role="img"]')
                    if (quote == 1) {
                        imgSrc = content
                        imgs = imgSrc.find('i.img')
                    }
					if (imgs.length > 0) {
						//获取图片ID
						let imgId = ft.photo_id
						imgs.each(function(i, img) {
							let strStyle = $(img).attr('style')
							if (strStyle) {
								strStyle = strStyle.split('url(\'')[1];
								strStyle = strStyle.split('\')')[0];

								let imgUrl = strStyle.replace(/\\3a\s/gi, ":");
								imgUrl = imgUrl.replace(/\\3d\s/gi, "=");
								imgUrl = imgUrl.replace(/\\26\s/gi, "&");
                                imgUrl = imgUrl.replace(/\\25\s3A/gi, ":");
                                imgUrl = imgUrl.replace(/\\25\s2F/gi, "/");
								//console.log('imgUrl============>', imgUrl);
								imglist.push({
									url: imgUrl,
									ariaLabel: $(img).attr('aria-label'),
									imgId:imgId,//图片ID
									width: '100%',
									height: '100%'
								});
							}
						})
					}
                    //console.log('content.text()===========>', content.text())

					let listData = {
						publisher_link: publisher_link, // 发布人链接
						publisher_avatar: publisher_avatar, // 发布人头像
						publisher: username,
						publisher_id: publisher_id,
						groupsName: groupsName,
						permalinkId: permalinkid,
						updateTime: updatetime,
						source_url: source_url,
						publishTime: publishtime,
						groupsId: groupsId,
						content: content.text(),
						describe: content.html(),
						attachment: JSON.stringify(imglist),
						userId: userId
					}

					console.log(listData)

					let checkData = {
						permalinkid: permalinkid
					}

                    if($(item).parent().eq(0).find(".copydata").length <= 0) {
                        if (listData.content <= '') {
                            $(item).before('  <input type="button" class="copydata" id="cp'+permalinkid+'" value="Goto Detail"  />  ')
                            return
                        }

                        $(item).before('  <input type="button" class="copydata" id="cp'+permalinkid+'" value="Copy Data"  />  ')

                        $('#cp'+permalinkid).click(function(event){
                            stopBubble(window.event);
                        })

                        if($('#cp'+permalinkid)) GM_xmlhttpRequest({
                            method: "POST",
                            url: baseUrl + '/tool/facebook/checkById',
                            data: JSON.stringify(checkData),
                            headers: {
                                "Content-Type": "application/json"
                            },
                            onload: function(res) {
                                if (res.status == 200) {
                                    let resData = JSON.parse(res.response);
                                    if(resData.data == '0') {
                                        //if($(item).parent().eq(0).find(".copydata").length <= 0) {
                                        /*
										$(item).before('  <input type="button" class="copydata" style="background-color: #15A2EE;border: 1px solid #15A2EE;border-radius: 4px;color: #ffffff;text-shadow: none;" id="cp'+permalinkid+'" value="Copy Data"  />  ')

                                        $('#cp'+permalinkid).click(function(event){
                                            stopBubble(window.event);
                                        })
                                        */
                                        //$('#cp'+permalinkid).prop("disabled","true")
                                        //$('#cp'+permalinkid).val("Copy Data ...")
                                        $('#cp'+permalinkid).css('background-color', '#15A2EE');
                                        $('#cp'+permalinkid).css('border', '1px solid #15A2EE');
                                        $('#cp'+permalinkid).css('color', '#ffffff');
                                        $('#cp'+permalinkid).css('border-radius', '4px');
                                        $('#cp'+permalinkid).css('text-shadow', 'none');

                                        $('#cp'+permalinkid).click(function(event){

                                            $('#cp'+permalinkid).prop("disabled","true")
                                            $('#cp'+permalinkid).val("Copy Data ...")
                                            $('#cp'+permalinkid).css('background-color', '#ffffff');
                                            $('#cp'+permalinkid).css('border', '1px solid #8d949e');
                                            $('#cp'+permalinkid).css('color', '#4b4f56');

                                            GM_xmlhttpRequest({
                                                method: "POST",
                                                url: baseUrl + '/tool/facebook/save',
                                                data: JSON.stringify(listData),
                                                headers:  {
                                                    "Content-Type": "application/json"
                                                },
                                                onload: function(res){
                                                    console.log('SaveData res ===》', JSON.parse(res.response), JSON.stringify(listData))
                                                    $('#cp'+permalinkid).val("Existed Data")
                                                }
                                            });
                                        })
                                        //}
                                    } else {
                                        //if($(item).parent().eq(0).find(".copydata").length <= 0) {
                                        /*
										$(item).before('  <input type="button" class="copydata" id="cp_'+permalinkid+'" value="Existed Data" />  ')
                                        $('#cp_'+permalinkid).click(function(event){
                                            stopBubble(window.event);
                                        })
                                        */
                                        $('#cp'+permalinkid).val("Existed Data");
                                        $('#cp'+permalinkid).css('background-color', '');
                                        $('#cp'+permalinkid).css('border', '');
                                        $('#cp'+permalinkid).css('color', '');
                                        $('#cp'+permalinkid).css('text-shadow', '');
                                        //}
                                    }
                                }
                            }
                        })
                    }

				}
			}
         } catch(err) {return;}
     }

    //#####################
     function getCookie(name) {
         var arrstr = document.cookie.split("; ");
         for (var i = 0; i < arrstr.length; i++) {
             var temp = arrstr[i].split("=");
             if (temp[0] == name) return unescape(temp[1]);
         }
     }

    function setCookie(name, value) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }

    function stopBubble(e) {
        //如果提供了事件对象，则这是一个非IE浏览器
        if ( e && e.stopPropagation )
            //因此它支持W3C的stopPropagation()方法
            e.stopPropagation();
        else
            //否则，我们需要使用IE的方式来取消事件冒泡
            window.event.cancelBubble = true;

        //阻止默认浏览器动作(W3C)
        if ( e && e.preventDefault )
            e.preventDefault();
        //IE中阻止函数器默认动作的方式
        else
            window.event.returnValue = false;
    }
});
