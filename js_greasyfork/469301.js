// ==UserScript==
// @name         teacheredu-教师教育网-全员培训
// @namespace    代刷vx：shuake345
// @version      0.2
// @license      hunter
// @description  自动看课程||时间够后自动退||自动切换新课程||————定制代刷vx：shuake345
// @author       代刷vx：shuake345
// @match        *://*.teacheredu.cn/proj/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=teacheredu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469301/teacheredu-%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91-%E5%85%A8%E5%91%98%E5%9F%B9%E8%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/469301/teacheredu-%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91-%E5%85%A8%E5%91%98%E5%9F%B9%E8%AE%AD.meta.js
// ==/UserScript==
(function() {
	'use strict';
	// 禁用 window.alert 弹窗
	window.alert = function() {}

	function playVideoFunc() {
		// 定义 PlayVideoClass 类的实例
		var playVideoClass = new PlayVideoClass();
		// 定义播放器样式
		let playVideoStyle = `
                    .zhm_play_vidoe_icon{
                        padding-top:2px;cursor:pointer;
                        z-index:9999999;
                        display:block;
                        position:fixed;${iconVipPosition}:0px;top:${iconVipTop}px;text-align:center;overflow:visible
                    }
                    .zhm_play_video_wrap{
                        position:fixed;${iconVipPosition}:${iconVipWidth}px;top:${iconVipTop}px;
                        z-index:9999999;
                        overflow: hidden;
                        width:300px;
                    }
                    .zhm_play_video_line{
                        width:320px;
                        height:316px;
                        overflow-y:scroll;
                        overflow-x:hidden;
                    }
                    .zhm_play_vide_line_ul{
                        width:300px;
                        display: flex;
                        justify-content: flex-start;
                        flex-flow: row wrap;
                        list-style: none;
                        padding:0px;
                        margin:0px;
                    }
                    .zhm_play_video_line_ul_li{
                        padding:4px 0px;
                        margin:2px;
                        width:30%;
                        color:#FFF;
                        text-align:center;
                        background-color:#f24443;
                        box-shadow:0px 0px 10px #fff;
                        font-size:14px;
                    }
                    .zhm_play_video_line_ul_li:hover{
                        color:#260033;
                        background-color:#fcc0c0
                    }
                    .zhm_line_selected{
                        color:#260033;
                        background-color:#fcc0c0
                    }
                    .zhm_play_video_jx{
                        width:100%;
                        height:100%;
                        z-index:999999;
                        position: absolute;top:0px;padding:0px;
                    }
                `;
		// 自执行函数，用于避免变量与其他代码的作用域冲突。
		// 向页面添加样式
		domStyle.appendChild(document.createTextNode(playVideoStyle));
		domHead.appendChild(domStyle);
		// 如果用户设置了 videoPlayLineAdd 和 playVideoLineText，就获取新的播放线路数据
		if (GM_getValue('videoPlayLineAdd') == 22 && GM_getValue('playVideoLineText')) {
			let lineObj = playVideoClass.getLine(GM_getValue('playVideoLineText'));
			if (lineObj) {
				playLine = [...lineObj, ...playLine];
			}
		}
		//template:icon,playLine;
		// 开始构建播放器的 HTML 结构
		let playWrapHtml = "<div href='javascript:void(0)' target='_blank' style='' class='playButton zhm_play_vidoe_icon' id='zhmlogo'><img class='iconLogo' src='data:image/gif;base64,R0lGODlhZACWAPcAAPJEQ/v7+fnLyPjCwfRnZfnT0PJKSfjGxPv29PnY1/NbWvv18/aUk/rl4/rw7vnKyPaJiPrr6faamPRycfaLivv59/JJSPrv7fNVVPne3frt6/NQT/v6+PelpPagnvR3dvi6uPvz8fexr/nOzPegnvrk4vR1c/JGRfrq6PnQzvjCwPnS0PnZ1/vw7vna2feop/empfrc2vNUU/ixr/R4dvWJh/esqvJHRvvx7/ry8fNSUfNWVPjBwPV6efaMivnf3fi8uvWDgvv49vrp6Pry8PJPTvaYl/nT0fnW1PerqfRsa/RvbvWAf/V9fPnk4vi2tfRjYfRhX/vu7PNYV/JFRPnk4faHhfaXlvv39frh3/i7uvnNy/nOy/rs6verqvRgXvnd2/aGhPWRkPV/ffri4Prj4PiwrfnLyfaUkvRfXfJNTPjFw/eysfRlY/RxcPvv7fezsvi0svv28/abmveqqPepqPJMS/eysPWOjfNdXPRzcvv08vRubfro5veiofelo/NZWPnZ2PNpaPnU0vRfXvnHxfiurPjAv/nQzfrn5fnc2/e0svadnPe4t/aSkfNXVvRmZPetqvnY1vi8u/eioPitq/i/vfRwb/R1dPne3Paenfacmve3tvnRz/rj4faXlfV+fPWFhPJLSvaNi/WMjPR0c/aVk/WPj/adm/rp5/nIxvRoZvRiYfjDwvaVlPJOTfe2tfNqafJRUPekovaamfNaWfV8evnd3PnNzPnV1Pesq/jEw/V6ePR3d/ng3vrw7faWlPenpfafnfWPjviwrvNWVfnMyvi6ufV/fvV9e/nb2vru6/RkYvjAvvnIxfRiYPi9vPegn/V7efejofe1tPWCgfrm5PJIR/nc2vNcW/JQT/jFxPvy8PWDgfWBf/RsbPV5d/NpafNcXPnf3vaIhvRvb/ivrfnX1vNRUfaKifRtbPaZl/NeXPe5uPWCgPRravaIh/NoZ/nJx/WFg/i9u/R2dfjHxvjIxvNTUvi/vve1s/NeXQAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQElgAAACwAAAAAZACWAAAI/gABCBxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDilxIYESAACMIjFxpUIWDAA5UeFjI4uTJBCxzCsxhk8iQhTZt6sypwaaGDAsHBOUxlOULJCWQvKixcAODAQMYbGi6UkGPGj0UGOBKtqzZs2jTql3LtqMCE01MiK1KYsQIEls7fmFCa9EWF4kQhCiTQoUITUzSfOyQgkWKDkGSLtWoA9iuZUEzaw4gBZqVIhtR2ESBU6FmjDQOCdnMejMCLRMyLrC54ALNoKUpjnHRunfrTvUunpm94MEfkgMcXBigcuIl3r6jsz6joKIJCR4kmNgxEkMj3yXo/mkCJaiWBTVf9FiZM6lEbwSoTrQ9yEsK6wqqSOVxKMNWkjesudDcfABcQwdrfVwhA0UWhIHIZkL0QqAaK2zmiQ83ZATFEZoVMh8GymiGACUWcETFFQgE9UBEBmCgAAZjMUQACSQMqJAMZWjmgmIffZHASQuUEhEEIjwhAgQ2HmRDUDYspAZ0Qd1RYkgniMFAFBLFYFMMQCz0kk22JXTCg5mhQZYdVpBjx0Jy0BZmQk4EVYVCdWTGQTpkEVJUAC6AltAPNmWiwkIQfHkBBAn1YqcVZfkRpUI+xAFEHD4o0RABSRakA4BBjWJWB5nFhpABU0QxRYwY3ZGZLmflsZpN/mVMuVIbHASVhaxlMZLZKTmlEBQHsaR1Qog29SHfSKVkZsZa6mRGgUYTiGpQAUG94edCOpgUghevgLRFUC4ctAQDHjCwBHcKFXqSA4gSxEeZDukT1DKOHMuRHkFpcJBLMMm0UJw2zUkQHEF1gepCe2jmSzIeNWNTOwfxdJJPXgb1JgAWhBAUMA+1lgIzHJ1QxxabrGnQngEctdCSNiVBkDdBVXAtQ7WyxgEnj+T0VFRTycgAA0kSbFMrEFXg2x6UmCySV2DNRVEWQTH6kNHRpTIKFQQahEFmGBQdVCG5tAaGGxj9sUAFjHyETFBlRPTqSS8AEEYfrRVCSEVuBMWH/kebBAWC20HVIZAowmi8WQUi4DNRnTb54dF3NqUNERZB0UHQI5zUrBkOc+DaUN82HUPQW0zQ4HRCBCgVAHMDDRKUOxGlaJPlBcXDIWsNhAFRKEENQhBj2BwB2W025Qa1TZZCJPtJLh9UjTWtSfKOQ+/a1ABBop1EGlCZDRRBUKzEHpQXCVkwh+GbHVLdQlEEJQVBEgdAsUKqn8SUQLPZVEtE+Z9EvkIYWITmMoOFDmAtIYCIGUHuQRx7zEQhVsGKVgZCtZMsCCIJswmrGAIJX7EmEjf6FUGuk53tUAQHQclGRNAXABA6BBnu0UwIFJKHoODAI9k7SRtWGBQXNqQJ/mTYTAQUQoCgJMIjighKOXhok0o0BApcaM2zEoKJoIDBI2uIWkSSaBNaLEQGd6hgZshAg4WIISiq8EglgkKCiDjCJiEoRvmMgMLN4MAIGVqIIYLixIG06EUHQ4hV7DJBgZwiKESLSCgsYYi7IWQMMdRMBdigA4d8yyZiIAiRjIQkydjkfgAQRFC4cUCNdLA1XIDCQ06wvABICwBaOgmXuBeUgdyAcjYRRES6YQlzqJIgMoDDAINChjFE5BJBQQCu2gSkix2kJsUjyCVP0saH4MEmCJAjxiTAQhviUSKOsok8ChLLAMySiKpj3UA+gRuISCIowgAAEyKZmUlWciJ0/rPJFQqyySNl6iHtCwqWHIKyABjDg5tJZUUm8KucEeSPMLoIlAKwLId0QTrFvMghgsIFkVwTjtqwqG/umMeKQCIzPhCJKFj4P4Z87z6UzEgWbWKwkYDKJhUIn0tZo9CM0CAzRsjIjGp0EB30LwApaEiOxmhMjVigAUFpQSAFMoEreOAKE0BXQlh2kiYZZBaZ+QRD2ODNkmYkGJnJ5EHWwJMcrOGBCfnSSZwpEAMkIpk7VIgadhGABcDhnhtRwgBvYa+CxG9+cJITQqoYlBLMbCiy8ERm9oaQHG4vXYZq10HIGpRtkKUIgcgMMRTSgSP8QHiRYUi0FmKBcWSGF00p/kLYgqIIzxVEATQIgummWhFmZAYPQ5HBLTITAh5xJRaZYYdO0nA8nOrBLAeyyTl0woRuBkB3ZslhANbBEnTAQjMcmOJHVqsQZAYFEAMRByykEAEGmNUiJ6AAp4KCBYY5BLe6PR1C1AUTzRrEDL0TyA3m0EpfNOEiFhgGVDXThVcy5AWmPULPFAKwkwjMICewj01cAQAlgIE1K8CDLCTyDTNoWDOIuOBDUKYyhcg1AHQVCGNt8gViDFOSAmCAG9QgpmfAgxOpaA0CNFHKhxz2JwrhagCaZ5BFRPWl0jkJB7LgjEnMoAPBoMYaAoHL3lCHIvz6hb9IQqN/AuAGdexN/jMyEOU288kWFhmXB9BwLoxIwzeeeC4AaGAMN/cmBT0gEAiETKKCEGAWH/bzSTSQhC9kzQAZ1MwI9pOQNHxiEmAQo2YW4IJjiGEVhZ0PKDaDAuw6xALhAMc8hoEKCZCCCW5Ab9YOgoZ6mqFbsy4IRHlr6HRmqg0VDMQqcn0QHxRJBJUi3k0O4gghCMEVRSb2QAB1EkHRUijSjggz+xpjgtQvAKDMtkPKec6EDHIEhRS3Q/rZSXV/ZNfujre8503vek/k3Om2d0FIqB2tIuTb4db3QIbTVwEcxzTdM4gAHsDwB4hXIRRo+AMGIJBoaOHiWghqQWAgcYmroAMgl0j//mqj7ADkhiBQXl1Dvo0UAFDLJgdQuHQi0ImHK8SyJz9I6k6izoJ8+3o7tcnfXB6UmBdEAG7uxAcYwhjHDO8iFMjM0hXyAakL5OUnMTpBkO7mCEw9IW+Ji34r0gK/LWTQNmk50WEucz8PsSkViqZCfiT0gWA9AFofCNdPIoCCUGAGCWhlAIauEwkkcyGt/Prd8y6QvQeg7wf5QCvfPpSy2wQGCYFBUCi/9qy3ne8JMXxQvo6RoZpZIHE/yQoSknqV273on3+8QlqJeYQwLSy8HoiSvXoQzdukBQmx/EkevvjYQx4hCz5J7Q+yM6lQxcUWm31QbC6QqNuE853Hu/EV/pL8ACz/ZEZRO0IqHIALH4TuPD/ItylOkOIfPSjHPwjtE3JkQmVWITMICtALwmabSKAg7rd18Bd6zpIQYTZmC0FeiDd6BVF1vzctsPd+NhF/BZFy2FcQckZn/oYR6Dd4BZF/NrF6ABiBAjiBBzED9CR7ZAGCy0YQHfh/I8h2EngSJSBxklACwodNpDcUDngSCFAQywN8ECiDJehmMFgW/ad8AyF6LRiDnjeD0oEAMzBeDpYQaKd6A9F6UziET1iEvoEAK7CDo1Iqp8IQ/MUuDNGDAUB5UPaDBxGAehdVDTCHdJgBAvB9DBEpk5JsFKZYDJGEAfAs1teETqh9UEiB/hRBbQFgbdAHJg1xhSoHiVvIhYbohYg4EdtGckkWFEwGcUGBFICYEHDYeAOIEeTWJWRGVA6RcgCwPOJXiIwHAI53iRLBbqdnEd/WeoRHibE4ixkBbx8xiJohhq9HhHFoguqWcmmnEKMoi6Uobo5Xd6JIgscIeurGhNPHjNRIisg4FKnzEj3XEDm4hgvRjL6IEfxmQgoBTYTIEK3netNojNxojcJBHAZ3bScBERJAh3NIfQXRCAkQkAlgCAYBAvy4ixUxct02EAAncAaBc1XBAISUFw45ENOACyyAC36QWhU5EVMwAU0wAWXYkSRZkiZ5kh4RQVlBkR25D03QNLknPBANWZJewAI883wJcRolyWKvaBDsaHImWX/oxHO3SG/5UBQaYAlwhZIMYQqA8gOmUJRMOZVUWZVWaZUBAQAh+QQBlgAAACwGAAYAWQCLAIcyzTLx0UXxpUTyX0PySEPyVkPyeUTygkTwyETzTUPxykXyikTwx0TxtkXyUUPxt0TxrkXxxkXwv0TymETyi0PxuUTyakPxyEXxxEXyaEPxu0TxzEXxzUXykUTxlETyUkPyj0TxhkTxpETybkTxtEXxw0XynETxgkTyVEPye0TyZUPxoETxsETyeUPybEPxskTxu0XydETxrETycEPyZ0Pxv0XxeUTxzUTymkTxj0Txk0PyY0PxrkTyjUTxp0TyWkPyaUPxhETxo0TxdUPyoUTyWEPyckPxqUTxq0TxqkTyk0QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI/gAHQAgQAMIAAAgTKlzIsKHDhxAjRhRwIcAFAQseECTYQKLHjyBDNlSwUUGJjRtFqlzJMmGEjRFgCEApoqXNmxE7kKhBokOLBAcECDiQAKfRowgLjLAxogABpFCjSp1KtarVq1izat0KsYCFGRacJqAAAQKFolyxgmDxgAWIGDM31kx7FcNGDA1QEqR7lcPGDRc0buzIt6oMvxuQ5BggAAEDAQcLU7UQYkEIIB8ka97MubPnz6A/E3BQwMFTAAMoUIgc+qaBCSYmGBjgAaWH1jcrbKywAgFKBrht3vjLQAJKCcFbatioQYAB3wEYGEjOMgUOIjhS7EA4gDV1lQRQ/vxAcfq7+fPo04POkEE9SBUnFpxQ8eE5QQTT3U+seHGB8Y3I6QcRSQSZBB1BwAn40EsExVTbRjoo+JBOPPmE2gEHeCfhQkox5dSGIIYo4ogkKuSVES44xRhBkJUIwFoVvPCWYBy5aBdBeOkVgIsEBmBSXATNRWISiB2xAFBCEeUiZZZh5uKTUEYpZWGjlfYUUGUpWeJrsc0GZABCjqgbQbzp6OJwBG3AAI0BEEbimAHwtmIALW4Jm2waPlmlaVP26eefOKW22pM0BLFAEDR88CBBt5XoA0kK+LDAgdHxWFIJ/xEUIIk3BoCXfdHlRyIIL2ggYwwIsQdlAS4MkWJ5/oDGKuusC6n6JKuuOgUqfi52UOoLPmUawKYjMhhATJQmSGKPJi0aQIQlUmQRRqiplmeI8MlHH63cduutiHs+NWedJKZwp3ZsujnicgQ1Z2aJaAag5pdhiggnb1hCoCWJXOLZZ7jfBixwiPnuOyKTIVjwAb0uHhYABzLk8C6JfqUZGErqitgpXuNeu+Fabb3Vp1dgfTjwySijJ6jHG3bYFAHONkoihT21kKyLxsYkLLEiMlsCqNK5KG1/qbb3ZLbzZZby0ky3ZquL4Y331K6ijmgddtrt7CK7ATR3M7zEOQvtm7utUO2gLvY727+k8dn023AXxphv5B5cWcIfpNuwUV8QS6yXixXLexFNNt7VQMFokdgDDw/w0AOqU6JAwww0kBf35ZhfheRQiY9YxAweEsBwiUo8UGELExcLEwx6l+hzxy4K8VIEQizQ5wHLaZBhQAAh/hVNYWRlIHdpdGggU2NyZWVuVG9HaWYAOw==' title='点击主图标弹出解析，点击右侧列表站内解析' style='width:" + iconVipWidth + "px'>";
		playWrapHtml += "<div class='playLineDiv zhm_play_video_wrap' style='display:none;'>"
		playWrapHtml += "<div class='zhm_play_video_line'>";
		playWrapHtml += "<div><ul class='zhm_play_vide_line_ul'>";
		// 遍历播放线路数据，为每个线路创建一个列表项
		playLine.forEach(function(item) {
			let selected = '';
			if (playVideoClass.getCookie('playLineAction') == item.url) {
				selected = 'zhm_line_selected';
			}
			playWrapHtml += `<li class='playLineTd zhm_play_video_line_ul_li ${selected}' url='${item.url}' >${item.name}</li>`;
		})
		playWrapHtml += "</div></div></div>";
		// 播放器支持的网站列表及相关数据
		let playJxHtml = "<div class='zhm_play_video_jx'>";
		playJxHtml += "<iframe allowtransparency=true frameborder='0' scrolling='no' allowfullscreen=true allowtransparency=true name='jx_play' style='height:100%;width:100%' id='playIframe'></iframe></div>";
		let jxVideoData = [{
				funcName: "playVideo",
				node: ".player__container",
				match: /https:\/\/v.qq.com\/x\/cover\/[a-zA-Z0-9]+.html/,
				areaClassName: 'mod_episode',
				name: 'qqPC'
			},
			{
				funcName: "playVideo",
				node: "#player-container",
				match: /https:\/\/v.qq.com\/x\/cover\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+.html/,
				areaClassName: 'mod_episode',
				name: 'qqPC'
			},
			{
				funcName: "playVideo",
				node: ".container-player",
				match: /v\.qq\.com\/x\/page/,
				areaClassName: 'mod_episode'
			},
			{
				funcName: "playVideo",
				node: "#player",
				match: /m\.v\.qq\.com\/x\/m\/play\?cid/
			},
			{
				funcName: "playVideo",
				node: "#player",
				match: /m\.v\.qq\.com\/x\/play\.html\?cid=/
			},
			{
				funcName: "playVideo",
				node: "#player",
				match: /m\.v\.qq\.com\/play\.html\?cid\=/
			},
			{
				funcName: "playVideo",
				node: "#player",
				match: /m\.v\.qq\.com\/cover\/.*html/
			},
			{
				funcName: "playVideo",
				node: "#flashbox",
				match: /^https:\/\/www\.iqiyi\.com\/[vwa]\_/,
				areaClassName: 'qy-episode-num',
				name: 'iqiyiPc'
			},
			{
				funcName: "playVideo",
				node: ".m-video-player-wrap",
				match: /^https:\/\/m.iqiyi\.com\/[vwa]\_/,
				areaClassName: 'm-sliding-list'
			},
			{
				funcName: "playVideo",
				node: ".intl-video-wrap",
				match: /^https:\/\/www\.iq\.com\/play\//,
				areaClassName: 'm-sliding-list'
			},
			{
				funcName: "playVideo",
				node: "#player",
				match: /m\.youku\.com\/alipay_video\/id_/
			},
			{
				funcName: "playVideo",
				node: "#player",
				match: /m\.youku\.com\/video\/id_/
			},
			{
				funcName: "playVideo",
				node: "#player",
				match: /v\.youku\.com\/v_show\/id_/
			},
			//{funcName:"playVideo", node:".player-container",nodeType:'id',match:/www\.bilibili\.com\/video/},
			{
				funcName: "playVideo",
				node: "#bilibili-player",
				nodeType: 'id',
				match: /www\.bilibili\.com\/video/,
				name: 'biliPc',
				areaClassName: 'video-episode-card'
			},
			{
				funcName: "playVideo",
				node: "#player_module",
				nodeType: 'id',
				match: /www\.bilibili\.com\/bangumi/,
				areaClassName: 'ep-list-wrapper report-wrap-module'
			},
			{
				funcName: "playVideo",
				node: ".player-container",
				nodeType: 'class',
				match: /m\.bilibili\.com\/bangumi/,
				areaClassName: 'ep-list-pre-container no-wrap'
			},
			{
				funcName: "playVideo",
				node: ".mplayer",
				nodeType: 'class',
				match: /m\.bilibili\.com\/video\//
			},
			{
				funcName: "playVideo",
				node: ".video-area",
				nodeType: 'class',
				match: /m\.mgtv\.com\/b/
			},
			{
				funcName: "playVideo",
				node: "#mgtv-player-wrap",
				nodeType: 'id',
				match: /mgtv\.com\/b/,
				areaClassName: 'episode-items clearfix'
			},
			{
				funcName: "playVideo",
				node: ".x-player",
				nodeType: 'class',
				match: /tv\.sohu\.com\/v/
			},
			{
				funcName: "playVideo",
				node: ".x-cover-playbtn-wrap",
				nodeType: 'class',
				match: /m\.tv\.sohu\.com/
			},
			{
				funcName: "playVideo",
				node: "#playerWrap",
				nodeType: 'id',
				match: /film\.sohu\.com\/album\//
			},
			{
				funcName: "playVideo",
				node: "#le_playbox",
				nodeType: 'id',
				match: /le\.com\/ptv\/vplay\//,
				areaClassName: 'juji_grid'
			},
			{
				funcName: "playVideo",
				node: "#player",
				nodeType: 'id',
				match: /play\.tudou\.com\/v_show\/id_/
			},
			{
				funcName: "playVideo",
				node: "#pptv_playpage_box",
				nodeType: 'id',
				match: /v\.pptv\.com\/show\//
			},
			{
				funcName: "playVideo",
				node: "#player",
				nodeType: 'id',
				match: /vip\.1905.com\/play\//
			},
			{
				funcName: "playVideo",
				node: "#vodPlayer",
				nodeType: 'id',
				match: /www\.1905.com\/vod\/play\//
			},
		];
		// 创建一个 div 元素，并将其插入到页面中，该元素将包含播放器图标
		playVideoClass.createElement('div', 'zhmIcon');
		// 选择刚刚创建的元素
		let zhmPlay = document.getElementById('zhmIcon');
		// 为该元素添加 HTML 内容（将播放器图标包含在内）
		zhmPlay.innerHTML = playWrapHtml;
		// 筛选出当前页面与 jxVideoData 数组中条目的 URL 相匹配的数据
		let jxVideoWeb = jxVideoData.filter(function(item) {
			return location.href.match(item.match);
		})
		// 没有匹配的数据
		if (jxVideoWeb.length == 0) {
			// 为元素添加事件监听器，当用户单击图标时，显示提示消息
			document.querySelector('#zhmIcon')
				.addEventListener('click', function() {
					BaseClass.toast('请在视频播放页点击图标');
				})
		} else {
			// 解构赋值来获取匹配的数据
			var {
				funcName,
				match: nowMatch,
				node: nowNode,
				name: nowName
			} = jxVideoWeb[0];
			// 为播放器按钮添加事件监听器，当用户将鼠标悬停在按钮上时，显示播放线路列表
			document.querySelector('.playButton')
				.onmouseover = () => {
					document.querySelector(".playLineDiv")
						.style.display = 'block';
				}
			// 当用户将鼠标从按钮上移开时，隐藏播放线路列表
			document.querySelector('.playButton')
				.onmouseout = () => {
					document.querySelector(".playLineDiv")
						.style.display = 'none';
				}
			// 获取所有播放线路列表项的元素节点
			var playLineTd = document.querySelectorAll('.playLineTd');
			// 为每个播放线路列表项添加事件监听器，当用户单击列表项时，选择该项以及相应的行为
			playLineTd.forEach(function(item) {
				item.addEventListener('click', function() {
					playLineTd.forEach(function(e) {
						// 重置所有播放线路列表项的类
						e.setAttribute('class', 'playLineTd zhm_play_video_line_ul_li');
					})
					// 将当前播放线路列表项的类设置为选中状态
					this.setAttribute('class', 'playLineTd zhm_play_video_line_ul_li zhm_line_selected');
					// 将当前所选行为的 URL 写入 cookie 中，有效期为 30 天
					playVideoClass.setCookie('playLineAction', this.getAttribute('url'), 30);
					// 获取当前节点的元素节点
					let nowWebNode = document.querySelector(nowNode);
					// 如果当前节点存在，则将其 HTML 内容更改为播放器 HTML，同时设置播放器的 src 为选中的行为的 URL 加上页面的 URL
					if (nowWebNode) {
						nowWebNode.innerHTML = playJxHtml;
						let playIframe = document.querySelector('#playIframe');
						playIframe.src = item.getAttribute('url') + location.href;
					} else {
						// 如果当前节点不存在，则不执行任何操作
					}
				})
			})
			// 如果当前节点是 #player ，则执行以下代码
			if (nowNode == "#player") { //判断当前节点是否为视频播放器
				setTimeout(function() { //等待3秒后执行以下操作
					let youkuAd = document.querySelector('.advertise-layer'); //获取优酷广告层
					let ykAd = youkuAd.lastChild; //获取优酷广告层的最后一项
					ykAd.parentNode.removeChild(ykAd); //删除优酷广告层的最后一项
					document.querySelector('.kui-dashboard-0')
						.style = 'display:flex'; //显示控制条
					let playVideo = document.querySelector('.video-layer video'); //获取播放视频的节点
					playVideo.play(); //播放视频
					let n = 0;
					document.querySelector('.kui-play-icon-0')
						.addEventListener('click', function() { //监听播放/暂停按钮的点击事件
							let video = document.querySelector('.video-layer video'); //获取播放视频的节点
							if (n++ % 2 == 0) { //每次点击时都对n进行加一操作
								video.pause(); //暂停视频播放
							} else {
								video.play(); //播放视频
							}
						});
					playVideo.addEventListener('timeupdate', function() { //监听播放时间更新事件
						let youkuAd = document.querySelector('.advertise-layer'); //获取优酷广告层
						let ykAd = youkuAd.lastChild;
						if (ykAd) {
							ykAd.parentNode.removeChild(ykAd); //如果有广告，就删除
						}
						document.querySelector('.kui-dashboard-0')
							.style = 'display:flex'; //每秒更新一次控制条的状态
					});
				}, 3000); //3秒后执行以上操作
			}
			if (nowNode == "#flashbox") { //判断当前节点是否为flash播放器
				setTimeout(function() { //等待3秒后执行以下操作
					let dom = document.querySelector('.skippable-after'); //获取可跳过广告节点
					if (dom) {
						dom.click(); //单击可跳过广告节点
					}
				}, 3000); //3秒后执行以上操作
			}
			if (nowNode == "#player-container") { //判断当前节点是否为视频播放器容器
				let n = 0;
				let timer = setInterval(function() { //每500毫秒执行一次以下操作
					if (n++ < 100) {
						let panelTipVip = document.querySelector('.panel-overlay'); // 声明一个变量panelTipVip来查找第一个class名为’panel-overlay’的元素，该变量用于存储VIP面板的提示
						if (panelTipVip) {
							// 如果panelTipVip存在，将其样式的display属性设为’none’，同时停止计时器
							panelTipVip.style.display = 'none';
							clearInterval(timer);
						} // 如果panelTipVip不存在，也停止计时器
					} else {
						clearInterval(timer);
					}
				}, 100)
			}
			// 如果当前节点是’#le_playbox’，则在3秒后执行以下操作
			if (nowNode == "#le_playbox") {
				setTimeout(function() {
					// 查找所有class名为’j_block’的元素并存储起来
					let jBlock = document.querySelectorAll('.j_block');
					// 如果jBlock不存在，则退出函数
					if (!jBlock) return;
					// 否则，遍历jBlock并在每个jBlock元素的第一个子元素（即链接）的href属性中添加视频链接
					for (let i = 0; i < jBlock.length; i++) {
						let videoId = jBlock[i].getAttribute('data-vid');
						let link = `https://www.le.com/ptv/vplay/${videoId}.html`;
						jBlock[i].firstChild.setAttribute('href', link);
					}
				}, 3000)
			}
			// 如果当前节点是’.player-container’，则在3秒后执行以下操作
			if (nowNode == ".player-container") {
				setTimeout(function() {
					// 如果不存在class名为’player-container’的元素和class名为’bpx-player-container’的元素，则将nowNode设为’.player-mask’
					if (!document.querySelector('.player-container') && !document.querySelector('.bpx-player-container')) {
						nowNode = '.player-mask';
					} else {
						// 否则，将nowNode设为’.bpx-player-container’
						nowNode = '.bpx-player-container';
					}
				}, 3000)
			}
			// 当点击iconLogo元素时执行以下操作
			document.querySelector('.iconLogo')
				.addEventListener('click', function() {
					// 请求指定URL中的内容，在请求完成时将结果进行处理并跳转到指定的URL
					playVideoClass.request('get', `${zhmApiUrl}/jxcode.php?in=${jxCodeInfo.in}&code=${jxCodeInfo.code}`)
						.then((result) => {
							location.href = `${zhmApiUrl}/jxjx.php?lrspm=${result}&zhm_jx=${location.href}`;
						})
						.cath(err => {})
				})
			// 当文档中发生点击事件时执行以下操作
			document.addEventListener('click', function(e) {
				// 如果当前名称是’iqiyiPc’，则遍历路径中的每个元素，当有class名为’txt-wsize’的元素时，在该元素的下一个兄弟节点中添加’-'字符，然后退出函数
				if (nowName == 'iqiyiPc') {
					// 遍历所有包含在事件目标路径中的元素
					e.path.forEach(function(item) {
						// 如果该元素的class包含‘select-item’，则执行以下代码
						if (item.className.indexOf('select-item') != -1) {
							// 等待1000毫秒，然后重新加载当前页面
							setTimeout(function() {
								location.href = location.href;
							}, 1000)
						}
					})
					// 等待5000毫秒
					setTimeout(function() {
						// 获取class为‘skippable-after’的元素
						let dom = document.querySelector('.skippable-after');
						// 如果该元素存在，则执行以下代码
						if (dom) {
							// 触发该元素的click事件
							dom.click();
						} else {
							return;
						}
					}, 5000)
				}
				// 定义一个空数组areaClassName
				let areaClassName = [];
				// 遍历所有包含在事件目标路径中的元素
				e.path.filter(function(item) {
					// 如果该元素的class为当前站点中的区域类名nowWeb[0].areaClassName，则将该元素加入数组areaClassName
					if (item.className == nowWeb[0].areaClassName) {
						areaClassName = item;
					};
				})
				// 如果数组areaClassName的长度为0，则退出当前函数
				if (areaClassName.length == 0) {
					return;
				}
				// 如果当前站点名为“qqPC”，则执行以下代码
				if (nowName == 'qqPC') {
					// 遍历所有包含在事件目标路径中的元素
					e.path.forEach(function(item) {
						// 如果该元素的class为‘episode-list-rect__item’，或者该元素的class包含‘episode-item’，则执行以下代码
						if (item.className == 'episode-list-rect__item' || item.className.indexOf('episode-item') != -1) {
							setTimeout(function() {
								// 等待1000毫秒，然后重新加载当前页面
								location.href = location.href;
							}, 1000)
						}
					})
				}
				// 如果当前站点名为“biliPc”，则执行以下代码
				if (nowName == 'biliPc') {
					// 定义一个数组className，其中包含名为‘bpx-player-video-area’的class
					let className = ['bpx-player-video-area'];
					// 定义一个变量matchNum，并初始化为0
					let matchNum = 0;
					// 遍历所有包含在事件目标路径中的元素
					e.path.filter(function(item) {
						// 如果该元素的class名包含在数组className中，则将变量matchNum的值加1
						if (className.indexOf(item.className) != -1) {
							matchNum++;
						}
					})
					// 如果匹配到的个数大于 0，直接退出函数
					if (matchNum > 0) {
						return;
					}
					// 延迟执行
					setTimeout(function() {
						// 定义视频类名数组
						let videoClassName = ['video-episode-card'];
						// 使用 path 方法过滤出含有视频类名的元素，并重新赋值给路径数组
						e.path.filter(function(item) {
							if (videoClassName.indexOf(item.className) != -1) {
								// 如果找到视频类名，则刷新当前页
								location.href = location.href;
							}
						})
					})
				}
				// 初始化链接对象
				var objLink = {};
				// 遍历路径数组中的每个元素
				e.path.forEach(function(item) {
					// 如果是链接，则提取链接 href 和 target 属性
					if (item.href) {
						objLink.href = item.href ? item.href : '';
						objLink.target = item.target ? item.target : '';
						return;
					}
				})
				// 如果链接存在且 target 不是 “_blank”，则在当前窗口中打开链接并退出函数
				if (objLink.href && objLink.target != '_blank') {
					location.href = objLink.href;
					return;
				}
			})
			// 如果当前是 qqPC，点击元素时打开对应链接
			if (nowName == 'qqPC') {
				// 获取所有 figure 和 figure_detail 元素
				let figure = document.querySelectorAll('.figure');
				let figureDetail = document.querySelectorAll('.figure_detail');
				// 将两个元素数组合并成一个数组
				let listItem = [...figure, ...figureDetail];
				if (listItem.length > 0) {
					// 遍历数组中的每个元素并添加点击事件监听
					listItem.forEach(function(item) {
						item.addEventListener('click', function() {
							let link = this.getAttribute('href');
							if (link) {
								// 在当前窗口中打开链接并退出函数
								location.href = link;
								return;
							}
						})
					});
				}
			}
		}
	}
    function creatButton(){
        // 创建按钮元素
        const myButton = document.createElement('button');

        // 设置按钮文本和ID
        const buttonText = '清除本地缓存';
        const buttonId = 'myButton1';

        // 设置按钮样式
        myButton.textContent = buttonText;
        myButton.id = buttonId;


        // 添加按钮样式
        myButton.style.backgroundColor = '#008CBA';
        myButton.style.color = 'white';
        myButton.style.padding = '10px 20px';
        myButton.style.border = '1px solid black';
        myButton.style.display = 'inline-block';
        myButton.style.margin = '4px 2px';
        myButton.style.fontSize = '20px';
        myButton.style.fontWeight = 'bolder';
        myButton.style.WebkitTextStroke = "1px puple";
        myButton.style.letterSpacing = "2px";

        // 添加按钮到页面
        if (document.getElementById('myButton1')==null){
            document.querySelector("#ser > a").parentNode.appendChild(myButton);
        }
        // 获取按钮元素
        const button = document.getElementById('myButton1');
        // 添加按钮点击事件监听器
        button.addEventListener('click', function() {
            // 在这里编写点击事件的处理逻辑
            localStorage.clear();
            button.innerHTML = "已清除本地缓存";
            alert("已清除本地缓存");
            console.log("已清除本地缓存");
        });
    }

// 定义 zy 函数，用于自动开始学习和点击下一个课程。
	function zy() {
		// 如果当前URL字符串中含有‘courseListNew’，则获取本地存储中的‘YorN’值
		if (document.URL.search('courseListNew') > 1) {
            creatButton();
			var studyYorN = localStorage.getItem('YorN') // 获取本地存储中的‘YorN’值

			console.log("studyYorN:"+studyYorN) // 输出‘studyYorN’的值
			var gostudy = document.querySelectorAll('div.list>div.kcxx_side_title>p>a') // 获取课程列表中的课程对象

			var sessiond = localStorage.getItem('key') // 获取本地存储中的‘key’值
			// 输出‘sessiond’的值
			console.log("sessiond:"+sessiond)
			// 如果‘sessiond’为空，则将‘key’值设置为第一个课程对象的‘onclick’属性
			if (sessiond == null) {
				localStorage.setItem('key', gostudy[0].attributes["onclick"].value)
				// 点击第一个课程对象
				gostudy[0].click();
                console.log("学习第一个课程！");
			}
			// 如果‘studyYorN’的值为‘No’
			if (studyYorN == "No") {
				for (var i = 0; i < gostudy.length - 1; i++) {
					// 如果‘sessiond’的值等于第i个课程对象的‘onclick’属性，就设置‘key’值为下一个课程对象的‘onclick’属性
					if (sessiond == gostudy[i].attributes["onclick"].value) {
						localStorage.setItem('key', gostudy[i + 1].attributes["onclick"].value)
						// 点击下一个课程对象
						gostudy[i + 1].click();
                        console.log(`学习第${i+1}个课程！`);
						localStorage.setItem('YorN', "Yes")
						break;
					} else if (i == gostudy.length - 2) {
						// 否则，点击‘下一页’按钮
                        console.log("下一页");
                         //下一页
						document.querySelectorAll('div.fanye>a.page_label')[1].click();
						setTimeout(function() {
							localStorage.setItem('key', gostudy[0].attributes["onclick"].value)
							gostudy[0].click();
							localStorage.setItem('YorN', "Yes")
						}, 1000)
					}

				}
			}
		}
	}
	// 每间隔16秒调用‘zy’函数
	setInterval(zy, 16000)
	// 定义函数‘cy’,用于检查学习时长是否足够，如果够，就关闭该课程
	function cy() {
		if (document.URL.search('courseId') > 1) {
			// 获取剩余时间和总时间，在检查是否播放完成
            //定义累计学习时间
			var bfeding = parseInt(document.querySelector('i#zonggong')
				.innerText.replace(/[^0-9]/ig, ""))
            // 定义课程时长
			var bfalllong = parseInt(document.querySelectorAll('div.title_tab_lists>div>div.introduce_list')[3].innerText.replace(/[^0-9]/ig, ""))
			if (bfeding >= bfalllong) { //播放完成
				console.log("播放完成");
				localStorage.setItem('YorN', "No");
                console.log("设置YorN完成");
				//关闭窗口
				closeWin();
			}
		}
	}
	// 每间隔8秒调用‘cy’函数
	setInterval(cy, 8000)
	// 定义函数‘c123’
	function c123() {
		if (document.URL.search('courseId') > 1) {
			// 获取课程结束时弹出的浮窗图标
			var d1 = document.getElementById("exit_study_btn");

			var img = document.createElement("img");

			img.style = "width:175px; height:175px;"

			img.src = "https://img.nuannian.com/files/images/22/0921/1663766968-1460.jpg";

			d1.appendChild(img);
		}
	}
	//setTimeout(c123, 6000)
    function start(){
        localStorage.clear();
        console.log("清除本地储存");
    }
    //setTimeout(start, 3000)
	// 定义函数 sy
	function sy() {
		// 判断页面 URL 是否包含 'bj/dcwj'
		if (document.URL.search('bj/dcwj') > 1) {
			// 定义函数 Reg_Get，用于从 HTML 中获取匹配 reg 的内容
			function Reg_Get(HTML, reg) {
				let RegE = new RegExp(reg);
				try {
					return RegE.exec(HTML)[1];
				} catch (e) {
					return "";
				}
			}
			// 定义函数 ACSetValue，用于设置 GM 和 localStorage 中的值
			function ACSetValue(key, value) {
				GM_setValue(key, value);
				if (key === 'Config') {
					if (value) localStorage.ACConfig = value;
				}
			}
			// 定义函数 getElementByXpath，用于获取特定 XPath 下的元素节点
			function getElementByXpath(e, t, r) {
				r = r || document, t = t || r;
				try {
					return r.evaluate(e, t, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
						.singleNodeValue;
				} catch (t) {
					// 如果 XPath 无效，则在控制台输出错误信息
					return void console.error("无效的xpath");
				}
			}
			// 定义函数 getAllElementsByXpath，用于获取满足特定 XPath 的所有元素节点
			function getAllElementsByXpath(xpath, contextNode) {
				var doc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
				contextNode = contextNode || doc;
				var result = [];
				try {
					var query = doc.evaluate(xpath, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
					for (var i = 0; i < query.snapshotLength; i++) {
						var node = query.snapshotItem(i); //if node is an element node
						// 如果节点是元素节点，则将该节点添加到结果数组中
						if (node.nodeType === 1) result.push(node);
					}
				} catch (err) {
					// 如果 XPath 无效，则抛出错误
					throw new Error(`Invalid xpath: ${xpath}`);
				} //@ts-ignore
				return result;
			}
			// 定义函数 getAllElements，用于获取满足特定 CSS 选择器的所有元素节点，或者满足 XPath 的所有元素节点
			function getAllElements(selector) {
				var contextNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
				var doc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
				var win = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : window;
				var _cplink = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
				if (!selector) return []; //@ts-ignore
				contextNode = contextNode || doc;
				if (typeof selector === 'string') {
					// 如果 CSS 选择器的前缀是 'css;'，则去掉前缀并调用 getAllElementsByCSS 函数获取元素节点
					if (selector.search(/^css;/i) === 0) {
						return getAllElementsByCSS(selector.slice(4), contextNode);
					} else {
						// 否则，调用 getAllElementsByXpath 函数获取元素节点
						return getAllElementsByXpath(selector, contextNode, doc);
					}
				} else {
					var query = selector(doc, win, _cplink);
					if (!Array.isArray(query)) {
						throw new Error('Wrong type is returned by getAllElements');
					} else {
						return query;
					}
				}
			}
		}
	}
	function closeWin() {
		try {
			//禁用onbeforeunload弹窗
			window.onbeforeunload = null;
			window.opener = window;
			var win = window.open("", "_self");
			console.log("关闭")
			win.close();
			top.close();
		} catch (e) {
			console.log('关闭失败' + e)
		}

	}
	/*
	function waitRandomBetween(minSecond = 2, MaxSecond = 5) {
	    if (MaxSecond <= minSecond) {
	        MaxSecond = minSecond + 3
	    }
	    let waitTime = Math.floor(Math.random() * (MaxSecond * 1000 - minSecond * 1000) + minSecond * 1000)
	    return new Promise((resolve, reject) => {
	        setTimeout(() => {
	            console.log(`随机等待${waitTime / 1000}秒`)
	            resolve()
	        }, waitTime)
	    })
	}
	function sleep(){
	     setTimeout(() => {
	            function a(){
	        console.log("等待10秒")
	                      }
	        }, 10000);}
	    setTimeout(() => {
	        waitRandomBetween(2,5);
	            myfunction()
	        }, 70000)
	function myfunction(){
	    window.onbeforeunload = null;
	    console.log("已阻止弹出提示")
	    waitRandomBetween(2,5);
	    closeWin();
	    console.log("关闭")}
	*/
})();
