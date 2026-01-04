// ==UserScript==
// @name         CHH一键评分
// @namespace    https://reeye.cn/
// @version      0.2.7
// @description  摆脱散分时的痛苦
// @author       Reeye
// @match        https://www.chiphell.com/thread-*.html
// @match        https://www.chiphell.com/forum.php?mod=viewthread&tid=*
// @grant        none
// @require      http://libs.baidu.com/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/389334/CHH%E4%B8%80%E9%94%AE%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/389334/CHH%E4%B8%80%E9%94%AE%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let body = document.getElementsByTagName('body')[0]
    let scoreScript = document.createElement('script')
    window.$ = function(id){return!id?null:document.getElementById(id);}
    scoreScript.innerHTML = `function oneKeyScore() {
    let $$ = window.jQuery;
	let currentUser = $$('#um .vwmy>a').text();
	let args = {
		ghost: $$('#reeye_ghost').is(":checked"),
		angel: $$('#reeye_angel').is(":checked"),
		all: $$('#reeye_all').is(":checked"),
		score: $$('#reeye_score').val(),
		reason: $$('#reeye_reason').val(),
		sendreasonpm: $$('#reeye_sendreasonpm').is(":checked"),
    };
    let matcher = window.location.href.match(/thread-(\\d*)-(\\d*)/) || window.location.href.match(/tid=(\\d*)&page=(\\d*)/);
	let tid = matcher[1];
	let page = matcher[2];
	let array = [];
	let postlist = $$('#postlist>div[id^="post_"]');
	for (let i = 0; i < postlist.length; i++) {
		let post = postlist[i];
		let pid = $$(post).attr('id').match(/post_(\\d*)/)[1];
		let postUser = {
			id: $$('#favatar' + pid + '>.pi>.authi>a').text(),
			level: $$('#favatar' + pid + ' a[href^="home.php?mod=spacecp&ac=usergroup&gid="]').text()
		};
		if (array.indexOf(postUser.id) === -1) {
			array.push(postUser.id);
		} else {
			continue;
		}
		if (((args.ghost && postUser.level === '亡灵') || (args.angel && postUser.level.indexOf('天使') > -1) || args.all) && postUser.id != currentUser) {
			$$('#result').show();
			$$.ajax({
				type: 'GET',
				url: 'https://www.chiphell.com/forum.php?mod=misc&action=rate&tid=' + tid + '&pid=' + pid + '&infloat=yes&handlekey=rate&t=' + new Date().getTime() + '&inajax=1&ajaxtarget=fwin_content_rate',
				dataType: 'text',
				success: function(data) {
					let formhash = data.match(/name="formhash"\\s+value="(\\w+)"/)[1];
					$$.ajax({
						type: 'GET',
						url: 'https://www.chiphell.com/forum.php?mod=misc&action=viewratings&tid=' + tid + '&pid=' + pid + '&infloat=yes&handlekey=viewratings&inajax=1&ajaxtarget=fwin_content_viewratings',
						dataType: 'text',
						success: function(data) {
							if (data.indexOf(currentUser) === -1) {
								$$.ajax({
			                        type: 'POST',
			                        url: 'https://www.chiphell.com/forum.php?mod=misc&action=rate&ratesubmit=yes&infloat=yes&inajax=1',
			                        dataType: 'text',
									data: {
										formhash: formhash,
			                            tid: tid,
			                            pid: pid,
			                            referer: 'https://www.chiphell.com/forum.php?mod=viewthread&tid=' + tid + '&page=' + page + '#pid' + pid,
			                            score1: args.score,
			                            reason: args.reason,
			                            sendreasonpm: args.sendreasonpm ? 'on' : ''
									},
			                        success: function(data) {
			                            if (data.indexOf('感谢') > -1) {
			                            	$$('#result').append('<span>' + postUser.id + '</span>&nbsp;&nbsp;');
			                            }
			                        },
			                        error: function(error) {
			                            console.log(error);
			                        }
			                    })
							}
						},
						error: function(error) {
							console.log(error);
						}
					});
				},
				error: function(error) {
                    console.log(error);
                }
            });
		}
	}
}`
    body.appendChild(scoreScript)

    let $$ = window.jQuery

    let canScore = $$('#ak_rate') ? true : false

    if (canScore) {
        let scoreBtn = '<span id="scoreSpan"><a href="javascript:void(0)" hidefocus="true" style="background:url(/static/image/common/agree.gif) 12px 7px no-repeat;height:10px;padding:10px 5px;filter:grayscale(1);" title="一键评分"></a></span>'
        $$('#scrolltop').append(scoreBtn)
        $$('#scoreSpan').hover(function() {
            $$('#scoreSpan>a').css('filter', 'none')
        }, function() {
            $$('#scoreSpan>a').css('filter', 'grayscale(1)')
        })
        $$('#scoreSpan').click(function() {

        })

        $$('#scoreSpan').click(function() {
            if ($$('#fwin_rate').length > 0) {
                $$('#fwin_rate').remove()
            } else {
                $$('#append_parent').append(`<div id="fwin_rate" class="fwinmask" style="position: fixed; z-index: 201;" initialized="true">
	<table cellpadding="0" cellspacing="0" class="fwin">
		<tbody>
			<tr style="cursor:move" onmousedown="dragMenu($('fwin_rate'), event, 1)" ondblclick="hideWindow('rate')">
				<td class="t_l"></td>
				<td class="t_c"></td>
				<td class="t_r"></td>
			</tr>
		 	<tr>
		  		<td class="m_l" style="cursor:move">&nbsp;&nbsp;</td>
		  		<td class="m_c" id="fwin_content_rate" fwin="rate" style="">
			   		<div class="tm_c" id="floatlayout_topicadmin" fwin="rate">
			    		<h3 class="flb" id="fctrl_rate" style="cursor: move;" onmousedown="dragMenu($('fwin_rate'), event, 1)" ondblclick="hideWindow('rate')">
			    			<em id="return_rate" fwin="rate">一键评分</em>
			    			<span>
			    				<a href="javascript:;" class="flbc" onclick="hideWindow('rate')" title="关闭">关闭</a>
			    			</span>
			    		</h3>
			    		<div style="padding: 4px 8px;">
			    			<p style="padding: 3px 1px">
			    				加分对象:
					    		<label for="reeye_ghost">
							     	<input type="checkbox" id="reeye_ghost" class="pc" checked />
							     	亡灵
							    </label>
							    &nbsp;&nbsp;
					    		<label for="reeye_angel">
							     	<input type="checkbox" id="reeye_angel" class="pc" checked />
							     	天使
							    </label>
							    &nbsp;&nbsp;
							    <label for="reeye_all">
							     	<input type="checkbox" id="reeye_all" class="pc" checked />
							     	所有
							    </label>
						    </p>
						    <p style="padding: 3px 1px">
						    	加分数量: <input type="number" name="score" id="reeye_score" class="pc" value="5" />
						    </p>
						    <p style="padding: 3px 1px">
						    	评分理由: <input type="text" name="reason" id="reeye_reason" class="pc" value="顶" />
						    </p>
						    <p style="padding: 3px 1px">
							    <label for="reeye_sendreasonpm">
							    	通知作者:
							     	<input type="checkbox" id="reeye_sendreasonpm" class="pc" checked/>
							    </label>
							</p>
							<p style="padding: 3px 1px; text-align: center;">
								<button class="pn pnc" onclick="oneKeyScore()"><span>确定</span></button>
							</p>
			    		</div>
                        <div id="result" style="display: none;font-size: 12px;padding: 5px; max-width: 220px;">
			    			<p>已为如下chher加分:</p>
			    		</div>
			    		<div style="font-size: 12px;color: #ddd;text-align: right;padding: 10px 5px 5px 5px;">made by <a style="color: #ddd;" href="https://www.chiphell.com/space-uid-280258.html">叶拟冉</a></div>
				    </div>
				    <script type="text/javascript" reload="1">
						function succeedhandle_rate(locationhref) {
							ajaxget('forum.php?mod=viewthread&tid=1944231&viewpid=41079030', 'post_41079030', 'post_41079030');
							hideWindow('rate');
						}
						loadcss('forum_moderator');
					</script>
				</td>
			  	<td class="m_r" style="cursor:move" onmousedown="dragMenu($('fwin_rate'), event, 1)" ondblclick="hideWindow('rate')"></td>
		 	</tr>
			<tr style="cursor:move">
				<td class="b_l"></td>
				<td class="b_c" onmousedown="dragMenu($('fwin_rate'), event, 1)" ondblclick="hideWindow('rate')"></td>
				<td class="b_r"></td>
			</tr>
		</tbody>
	</table>
</div>
`)
                $$('#fwin_rate').css('left', (window.innerWidth - $$('#fwin_rate').width()) / 2 + 'px').css('top', (window.innerHeight - $$('#fwin_rate').height()) / 2 + 'px')
            }
        })
    }
})();