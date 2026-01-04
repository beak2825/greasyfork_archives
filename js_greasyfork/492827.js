// ==UserScript==
// @name         Bili Trends Extend
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  B站动态页功能增强
// @author       Yi MIT
// @match        https://t.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.jsdelivr.net/npm/flv.js@1.6.2/dist/flv.min.js
// @require      https://cdn.jsdelivr.net/npm/glider-js@1/glider.min.js
// @resource customCSS https://cdn.jsdelivr.net/npm/glider-js@1/glider.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_cookie
// @connect      *
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492827/Bili%20Trends%20Extend.user.js
// @updateURL https://update.greasyfork.org/scripts/492827/Bili%20Trends%20Extend.meta.js
// ==/UserScript==

(function() {

	const css = GM_getResourceText("customCSS")
	GM_addStyle(css)

	let session = ''
	let liveList = new Array()
	var hoverTime = 0
	var removeTime = 0
	let isHovering = false
	let myInfo = ''
	let flv = null
	let playPromise = null
	let midTemp = null
	let glider

	setTimeout(async () => {
		let section = document.querySelectorAll('section')
		while (section.length > 5) {
			let len = section.length
			section[len - 2].parentNode.removeChild(section[len - 2])
			section = document.querySelectorAll('section')
		}
		session = await getSessdata()
		liveList = await getLiveList()
		console.log(liveList)

		//重置正在直播列表
		let liveingList = document.querySelectorAll('.bili-dyn-live-users__container')
		if (liveingList.length != 0) {
			let liveingListParent = liveingList[0].parentNode
			while (liveingListParent.hasChildNodes()) {
				liveingListParent.removeChild((liveingListParent.firstChild))
			}

			//创建信息卡片
			let live_info_card = document.createElement('section')
			let sticky = document.querySelectorAll('.sticky')
			let right = document.querySelectorAll('.right')
			live_info_card.classList.add('live_info_card')
			live_info_card.style.height = '250px'
			live_info_card.style.display = 'none'

			//直播信息卡片
			let live_frame_card = document.createElement('section')
			live_frame_card.classList.add('live_frame_card')
			live_frame_card.style.height = '310px'
			live_frame_card.style.display = 'none'

			right[0].insertBefore(live_info_card, sticky[0])
			right[0].insertBefore(live_frame_card, sticky[0])
			sticky = document.querySelectorAll('.sticky')
			sticky[sticky.length - 1].classList.remove('sticky')
			sticky[sticky.length - 1].style.cssText = 'position: sticky; top: 72px'

			//主播信息
			let live_info_card_child = document.createElement('div')
			live_info_card_child.classList.add('bili-user-profile__content', 'live_info_card_child')
			live_info_card_child.style.borderRadius = '6px'
			live_info_card_child.style.backgroundColor = 'white'
			live_info_card_child.style.height = '100%'
			live_info_card.appendChild(live_info_card_child)

			let bili_user_profile_view = document.createElement('div')
			bili_user_profile_view.classList.add('bili-user-profile-view')
			live_info_card_child.appendChild(bili_user_profile_view)

			let bili_user_profile_view__background = document.createElement('div')
			bili_user_profile_view__background.classList.add('bili-user-profile-view__background')
			bili_user_profile_view__background.style.width = '100%'
			bili_user_profile_view.appendChild(bili_user_profile_view__background)

			let bili_user_profile_view__avatar = document.createElement('a')
			bili_user_profile_view__avatar.classList.add('bili-user-profile-view__avatar')
			bili_user_profile_view__avatar.target = '_blank'
			bili_user_profile_view.appendChild(bili_user_profile_view__avatar)

			let bili_user_profile_view__avatar__face = document.createElement('div')
			bili_user_profile_view__avatar__face.classList.add('bili-user-profile-view__avatar__face',
				'b-img--face', 'b-img')
			bili_user_profile_view__avatar.appendChild(bili_user_profile_view__avatar__face)

			let b_img__inner = document.createElement('picture')
			b_img__inner.classList.add('b-img__inner')
			bili_user_profile_view__avatar__face.appendChild(b_img__inner)

			let source_image_webp = document.createElement('source')
			source_image_webp.classList.add('source-image-webp')
			source_image_webp.type = 'image/webp'
			b_img__inner.appendChild(source_image_webp)

			let face_img = document.createElement('img')
			face_img.classList.add('face-img')
			face_img.loading = 'lazy'
			b_img__inner.appendChild(face_img)

			let bili_user_profile_view__info = document.createElement('div')
			bili_user_profile_view__info.classList.add('bili-user-profile-view__info')
			bili_user_profile_view.appendChild(bili_user_profile_view__info)

			let bili_user_profile_view__info__header = document.createElement('div')
			bili_user_profile_view__info__header.classList.add('bili-user-profile-view__info__header')
			bili_user_profile_view__info.appendChild(bili_user_profile_view__info__header)

			let bili_user_profile_view__info__uname = document.createElement('a')
			bili_user_profile_view__info__uname.classList.add('bili-user-profile-view__info__uname')
			bili_user_profile_view__info__uname.target = '_blank'
			bili_user_profile_view__info__uname.style.color = 'rgb(251, 114, 153)'
			bili_user_profile_view__info__header.appendChild(bili_user_profile_view__info__uname)

			let bili_user_profil1e__info__body = document.createElement('div')
			bili_user_profil1e__info__body.classList.add('bili-user-profil1e__info__body')
			bili_user_profile_view__info.appendChild(bili_user_profil1e__info__body)

			let bili_user_profile_view__info__stats = document.createElement('div')
			bili_user_profile_view__info__stats.classList.add('bili-user-profile-view__info__stats')
			bili_user_profile_view__info__stats.style.paddingBottom = '5px'
			bili_user_profil1e__info__body.appendChild(bili_user_profile_view__info__stats)

			let bili_user_profile_view__info__stat_follow = document.createElement('a')
			bili_user_profile_view__info__stat_follow.classList.add(
				'bili-user-profile-view__info__stat', 'follow')
			bili_user_profile_view__info__stat_follow.style.paddingRight = '9px'
			bili_user_profile_view__info__stat_follow.target = '_blank'
			bili_user_profile_view__info__stats.appendChild(bili_user_profile_view__info__stat_follow)

			// let bili_user_follow = document.createElement('span')
			// bili_user_follow.classList.add('bili-user-follow')
			// bili_user_profile_view__info__stat_follow.appendChild(bili_user_follow)

			let bili_user_profile_view__info__stat_fans = document.createElement('a')
			bili_user_profile_view__info__stat_fans.classList.add('bili-user-profile-view__info__stat',
				'fans')
			bili_user_profile_view__info__stat_fans.style.paddingRight = '9px'
			bili_user_profile_view__info__stat_fans.target = '_blank'
			bili_user_profile_view__info__stats.appendChild(bili_user_profile_view__info__stat_fans)

			// let bili_user_fans = document.createElement('span')
			// bili_user_fans.classList.add('bili-bili_user_fans')
			// bili_user_profile_view__info__stat_fans.appendChild(bili_user_fans)

			let bili_user_profile_view__info__stat_like = document.createElement('div')
			bili_user_profile_view__info__stat_like.classList.add('bili-user-profile-view__info__stat',
				'like')
			bili_user_profile_view__info__stat_like.style.paddingRight = '9px'
			bili_user_profile_view__info__stats.appendChild(bili_user_profile_view__info__stat_like)

			// let bili_user_like = document.createElement('span')
			// bili_user_like.classList.add('bili-bili_user_like')
			// bili_user_profile_view__info__stat_like.appendChild(bili_user_like)

			let bili_user_profile_view__info__officialverify = document.createElement('div')
			bili_user_profile_view__info__officialverify.classList.add(
				'bili-user-profile-view__info__officialverify')
			bili_user_profile_view__info__officialverify.style.marginBottom = '5px'
			bili_user_profil1e__info__body.appendChild(bili_user_profile_view__info__officialverify)

			let officialverify = document.createElement('i')
			officialverify.classList.add('officialverify_yimit')
			bili_user_profile_view__info__officialverify.appendChild(officialverify)

			let officialverify_span = document.createElement('span')
			officialverify_span.classList.add('officialverify_span')
			bili_user_profile_view__info__officialverify.appendChild(officialverify_span)

			let bili_user_profile_view__info__signature = document.createElement('div')
			bili_user_profile_view__info__signature.classList.add(
				'bili-user-profile-view__info__signature')
			bili_user_profile_view__info__signature.style.fontSize = '12px'
			bili_user_profile_view__info__signature.style.overflow = 'hidden'
			bili_user_profile_view__info__signature.style.textOverflow = 'ellipsis'
			bili_user_profile_view__info__signature.style.display = '-webkit-box'
			bili_user_profile_view__info__signature.style.webkitLineClamp = '3'
			bili_user_profile_view__info__signature.style.webkitBoxOrient = 'vertical'
			bili_user_profil1e__info__body.appendChild(bili_user_profile_view__info__signature)

			//直播信息
			let bili_up_live_info = document.createElement('div')
			bili_up_live_info.classList.add('bili-up_live_info')
			bili_up_live_info.style.backgroundColor = 'white'
			bili_up_live_info.style.borderRadius = '6px'
			bili_up_live_info.style.height = '100%'
			live_frame_card.appendChild(bili_up_live_info)

			let bili_up_live_room_info = document.createElement('div')
			bili_up_live_room_info.classList.add('bili-up_live_room_info')
			bili_up_live_room_info.style.padding = '8px'
			bili_up_live_info.appendChild(bili_up_live_room_info)

			//标题
			let room_title = document.createElement('div')
			room_title.classList.add('room_title')
			room_title.style.display = 'flex'
			bili_up_live_room_info.appendChild(room_title)

			//观看人数
			let room_people_num = document.createElement('div')
			room_people_num.classList.add('room_people_num')
			bili_up_live_room_info.appendChild(room_people_num)

			//开播时间
			let room_start_time = document.createElement('div')
			room_start_time.classList.add('room_start_time')
			bili_up_live_room_info.appendChild(room_start_time)

			//持续时间
			let room_continued_time = document.createElement('div')
			room_continued_time.classList.add('room_continued_time')
			bili_up_live_room_info.appendChild(room_continued_time)

			let bili_up_live_room_video = document.createElement('div')
			bili_up_live_room_video.classList.add('bili-up_live_room_video')
			bili_up_live_info.appendChild(bili_up_live_room_video)

			let embla = document.createElement('div')
			embla.classList.add('embla')
			embla.style.overflow = 'hidden'
			bili_up_live_room_video.appendChild(embla)

			let embla_viewport = document.createElement('div')
			// embla_viewport.classList.add('embla_viewport')
			embla_viewport.classList.add('glider-contain')
			embla.append(embla_viewport)

			let bili_up_live_room_a = document.createElement('a')
			bili_up_live_room_a.classList.add('bili-up_live_room_a')
			bili_up_live_room_a.target = '_blank'
			bili_up_live_room_a.dataGlideEl = 'track'
			embla_viewport.appendChild(bili_up_live_room_a)

			let embla_container = document.createElement('div')
			embla_container.classList.add('glider')
			// embla_container.classList.add('embla_container')
			// embla_container.style.display = 'flex'
			// embla_container.style.width = '200%'
			embla_viewport.appendChild(embla_container)

			let embla_slide = document.createElement('div')
			embla_slide.classList.add('embla_slide')
			embla_slide.style.width = '318px'
			embla_container.appendChild(embla_slide)

			let embla_slide_1 = document.createElement('div')
			embla_slide_1.classList.add('embla_slide')
			embla_slide_1.style.width = '318px'
			embla_container.appendChild(embla_slide_1)

			let user_cover = document.createElement('img')
			user_cover.classList.add('user_cover')
			user_cover.style.maxHeight = '210.8px'
			user_cover.style.maxWidth = '318px'
			embla_slide_1.appendChild(user_cover)

			let live_video = document.createElement('video')
			live_video.classList.add('live_video')
			live_video.preload = 'none'
			live_video.style.maxHeight = '210.8px'
			live_video.style.maxWidth = '318px'
			live_video.controls = true
			live_video.muted = true
			embla_slide.appendChild(live_video)

			let tab_list = document.createElement('div')
			tab_list.role = 'tablist'
			tab_list.classList.add('dots')
			embla_viewport.appendChild(tab_list)

			let meta = document.createElement('meta')
			meta.httpEquiv = 'Content-Security-Policy'
			meta.content = 'upgrade-insecure-requests'
			let head = document.querySelectorAll('head')
			head[0].appendChild(meta)

			glider = new Glider(embla_container, {
				slidesToShow: 1,
				itemWidth: 1,
				dots: '.dots',
				draggable: true,
				skipTrack: false,
				exactWidth: true
			})

			for (let i = 0; i < liveList.length; i++) {
				let bili_dyn_live_users__container = document.createElement('div')
				bili_dyn_live_users__container.className = 'bili-dyn-live-users__container'
				liveingListParent.appendChild(bili_dyn_live_users__container)

				let bili_dyn_live_users__item_container = document.createElement('div')
				bili_dyn_live_users__item_container.className = 'bili-dyn-live-users__item-container'
				bili_dyn_live_users__item_container.addEventListener('click', () => {
					window.open(liveList[i].jump_url, '_blank')
				})
				bili_dyn_live_users__container.appendChild(bili_dyn_live_users__item_container)

				let bili_dyn_live_users__item = document.createElement('div')
				bili_dyn_live_users__item.className = 'bili-dyn-live-users__item'
				bili_dyn_live_users__item_container.appendChild(bili_dyn_live_users__item)

				let bili_dyn_live_users__item__left = document.createElement('div')
				bili_dyn_live_users__item__left.className = 'bili-dyn-live-users__item__left'
				bili_dyn_live_users__item.appendChild(bili_dyn_live_users__item__left)

				let bili_dyn_live_users__item__face = document.createElement('div')
				bili_dyn_live_users__item__face.className = 'bili-dyn-live-users__item__face'
				bili_dyn_live_users__item__left.appendChild(bili_dyn_live_users__item__face)

				let b_img__face_b_img = document.createElement('div')
				b_img__face_b_img.className = 'b-img--face b-img'
				bili_dyn_live_users__item__face.appendChild(b_img__face_b_img)

				let b_img__inner = document.createElement('picture')
				b_img__inner.className = 'b-img__inner'
				b_img__face_b_img.appendChild(b_img__inner)

				let image_avif = document.createElement('source')
				image_avif.type = 'image/avif'
				image_avif.srcset = liveList[i].face + '@96w_96h_!web-dynamic.avif'
				b_img__inner.appendChild(image_avif)

				let image_webp = document.createElement('source')
				image_webp.type = 'image_webp'
				image_webp.srcset = liveList[i].face + '@96w_96h_!web-dynamic.webp'
				b_img__inner.appendChild(image_webp)

				let img_face = document.createElement('img')
				img_face.src = liveList[i].face + '@96w_96h_!web-dynamic.webp'
				img_face.loading = 'lazy'
				img_face.onload = 'bmgCmptOnload(this)'
				img_face.onerror = 'bmgCmptOnerror(this)'
				b_img__inner.appendChild(img_face)

				//
				let bili_dyn_live_users__item__living = document.createElement('div')
				bili_dyn_live_users__item__living.className = 'bili-dyn-live-users__item__living'
				bili_dyn_live_users__item__left.appendChild(bili_dyn_live_users__item__living)

				let bili_dyn_live_users__item__right = document.createElement('div')
				bili_dyn_live_users__item__right.className = 'bili-dyn-live-users__item__right'
				bili_dyn_live_users__item.appendChild(bili_dyn_live_users__item__right)

				let bili_dyn_live_users__item__uname_bili_ellipsis = document.createElement('div')
				bili_dyn_live_users__item__uname_bili_ellipsis.className =
					'bili-dyn-live-users__item__uname bili-ellipsis'
				bili_dyn_live_users__item__uname_bili_ellipsis.innerText = liveList[i].uname + ''
				bili_dyn_live_users__item__right.appendChild(
					bili_dyn_live_users__item__uname_bili_ellipsis)

				let bili_dyn_live_users__item__title_bili_ellipsis = document.createElement('div')
				bili_dyn_live_users__item__title_bili_ellipsis.className =
					'bili-dyn-live-users__item__title bili-ellipsis'
				bili_dyn_live_users__item__title_bili_ellipsis.innerText = liveList[i].title + ''
				bili_dyn_live_users__item__right.appendChild(
					bili_dyn_live_users__item__title_bili_ellipsis)

				//绑定鼠标悬停事件
				bili_dyn_live_users__item_container.onmouseenter = function() {
					mouseHoverTime(liveList[i], live_info_card, live_frame_card, sticky[sticky
						.length - 1])
				}
				bili_dyn_live_users__item_container.onmouseleave = function() {
					mouseRemoveTime(liveList[i], live_info_card, live_frame_card, sticky[sticky
						.length - 1])
				}
			}

			live_info_card.onmouseenter = function() {
				if (removeTime !== null) {
					clearTimeout(removeTime)
				}
				if (hoverTime !== null) {
					clearTimeout(hoverTime)
				}
			}

			live_info_card.onmouseleave = function() {
				if (isHovering) {
					removeTime = setTimeout(() => {
						clearTimeout(hoverTime)
						reductionCardInfo('', live_info_card, live_frame_card, sticky[sticky
							.length - 1])
						isHovering = false
						midTemp = null
					}, 25000)
				}
			}

			live_frame_card.onmouseenter = function() {
				if (removeTime !== null) {
					clearTimeout(removeTime)
				}
				if (hoverTime !== null) {
					clearTimeout(hoverTime)
				}
			}

			live_frame_card.onmouseleave = function() {
				if (isHovering) {
					removeTime = setTimeout(() => {
						clearTimeout(hoverTime)
						reductionCardInfo('', live_info_card, live_frame_card, sticky[sticky
							.length - 1])
						isHovering = false
						midTemp = null
					}, 25000)
				}
			}
		}

		//--------------------------------------------------------------------------
		//--------------------------------------------------------------------------
		//获取B站sessdata
		function getSessdata() {
			return new Promise((resolve) => {
				GM_cookie.list({
					domain: '.bilibili.com',
					name: 'SESSDATA'
				}, (r) => {
					resolve(r)
				})
			})
		}

		//获取正在直播列表
		function getLiveList() {
			return new Promise((resolve, reject) => {
				GM_xmlhttpRequest({
					method: 'get',
					url: 'https://api.bilibili.com/x/polymer/web-dynamic/v1/portal',
					cookie: session,
					onload: function(response) {
						let json = JSON.parse(response.responseText)
						// console.log(json.data.live_users.items);
						resolve(json.data.live_users.items)
					}
				})
			})
		}

		//悬停时间
		/* function mouseHoverTime(user, live_info_card, live_frame_card, sticky_card) {
			if (removeTime != 0) {
				clearTimeout(removeTime)
			}
			hoverTime = setTimeout(() => {
				console.log(user)
				changeCardInfo(user, live_info_card, live_frame_card, sticky_card)
			}, 2000)
		}

		function mouseRemoveTime(user, live_info_card, live_frame_card, sticky_card) {
			if (hoverTime != 0) {
				removeTime = setTimeout(() => {
					clearTimeout(hoverTime)
					reductionCardInfo(user, live_info_card, live_frame_card, sticky_card)
				}, 50000)
			}
		} */

		//悬停时间
		function mouseHoverTime(user, live_info_card, live_frame_card, sticky_card) {
			if (removeTime !== null) {
				clearTimeout(removeTime)
			}
			if (hoverTime !== null) {
				clearTimeout(hoverTime)
			}
			if (!isHovering) {
				hoverTime = setTimeout(() => {
					isHovering = true
					midTemp = user.mid
					changeCardInfo(user, live_info_card, live_frame_card, sticky_card)
				}, 2000)
			} else if (midTemp != user.mid) {
				hoverTime = setTimeout(() => {
					console.log(midTemp, user.mid)
					isHovering = true
					midTemp = user.mid
					changeCardInfo(user, live_info_card, live_frame_card, sticky_card)
				}, 2000)
			}
		}

		function mouseRemoveTime(user, live_info_card, live_frame_card, sticky_card) {
			if (!isHovering) {
				clearTimeout(hoverTime)
			} else if (isHovering) {
				removeTime = setTimeout(() => {
					clearTimeout(hoverTime)
					reductionCardInfo(user, live_info_card, live_frame_card, sticky_card)
					isHovering = false
					midTemp = null
				}, 25000)
			}
		}

		//修改卡片信息
		async function changeCardInfo(user, live_info_card, live_frame_card, sticky_card) {
			let cardInfo = await requestCardInfo(user.mid)
			let cardLiveInfo = await getLiveInfo(user.room_id)
			let liveInfoSrc = await getLiveSrc(user.room_id)

			live_info_card.style.display = ''
			live_info_card.style.position = 'sticky'
			live_info_card.style.top = '72px'

			live_frame_card.style.display = ''
			live_frame_card.style.position = 'sticky'
			live_frame_card.style.top = '330px'

			let live_info_card_child = document.querySelectorAll('.live_info_card_child')
			sticky_card.style.cssText = 'position: sticky'
			sticky_card.style.top = '648px'
			let bili_user_profile_view__background = document.querySelectorAll(
				'.bili-user-profile-view__background')
			bili_user_profile_view__background[0].style.backgroundImage = 'url(' + cardInfo.space
				.s_img + '@732w_170h_1c.webp)'
			let bili_user_profile_view__avatar = document.querySelectorAll(
				'.bili-user-profile-view__avatar')
			bili_user_profile_view__avatar[0].href = 'https://space.bilibili.com/' + cardInfo.card
				.mid + '/dynamic'
			let source_image_webp = document.querySelectorAll('.source-image-webp')
			source_image_webp[0].srcset = cardInfo.card.face + '@96w_96h_!web-dynamic.webp'
			let face_img = document.querySelectorAll('.face-img')
			face_img[0].src = cardInfo.card.face + '@96w_96h_!web-dynamic.webp'
			let bili_user_profile_view__info__uname = document.querySelectorAll(
				'.bili-user-profile-view__info__uname')
			bili_user_profile_view__info__uname[0].href = 'https://space.bilibili.com/' + cardInfo
				.card.mid + '/dynamic'
			bili_user_profile_view__info__uname[0].innerText = cardInfo.card.name
			let bili_user_follow = document.querySelectorAll('.bili-user-profile-view__info__stat')
			bili_user_follow[0].innerHTML = '<span>' + estimateNum(cardInfo.card.attention) +
				'</span>关注'
			bili_user_follow[1].innerHTML = '<span>' + estimateNum(cardInfo.follower) + '</span>粉丝'
			bili_user_follow[2].innerHTML = '<span>' + estimateNum(cardInfo.like_num) + '</span>获赞'

			let bili_user_profile_view__info__officialverify = document.querySelectorAll(
				'.bili-user-profile-view__info__officialverify')
			let officialverify_yimit = document.querySelectorAll('.officialverify_yimit')
			let officialverify_span = document.querySelectorAll('.officialverify_span')
			officialverify_yimit[0].classList.remove('officialverify--1', 'officialverify--0')
			if (cardInfo.card.Official.type == -1) {
				officialverify_span[0].innerText = ''
				bili_user_profile_view__info__officialverify[0].style.display = 'none'
			} else {
				if (cardInfo.card.Official.type == 0) {
					officialverify_yimit[0].classList.add('officialverify--0')
					bili_user_profile_view__info__officialverify[0].style.display = ''
					officialverify_span[0].innerText = 'bilibili个人认证：' + cardInfo.card.Official
						.title
				} else if (cardInfo.card.Official.type == 1) {
					officialverify_yimit[0].classList.add('officialverify--1')
					bili_user_profile_view__info__officialverify[0].style.display = ''
					officialverify_span[0].innerText = 'bilibili机构认证：' + cardInfo.card.Official
						.title
				}
			}
			let bili_user_profile_view__info__signature = document.querySelectorAll(
				'.bili-user-profile-view__info__signature')
			bili_user_profile_view__info__signature[0].innerText = cardInfo.card.sign

			let room_url = 'https://live.bilibili.com/' + user.room_id

			//修改直播信息卡片
			let room_title = document.querySelectorAll('.room_title')
			room_title[0].innerHTML =
				'<span style="font-weight: 700;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: block;width: 280px;">' +
				cardLiveInfo.title + '</span>'
				 + '<a target="_blank" style="height: 20.8px; width: 22px;" href= "' + room_url + '">'
				 + '<svg t="1734879319387" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2466" width="20" height="20"><path d="M779.636364 954.181818h-535.272728A174.778182 174.778182 0 0 1 69.818182 779.636364v-535.272728A174.778182 174.778182 0 0 1 244.363636 69.818182H512a34.909091 34.909091 0 0 1 0 69.818182H244.363636A104.96 104.96 0 0 0 139.636364 244.363636v535.272728a104.96 104.96 0 0 0 104.727272 104.727272h535.272728a104.96 104.96 0 0 0 104.727272-104.727272V512a34.909091 34.909091 0 0 1 69.818182 0v267.636364a174.778182 174.778182 0 0 1-174.545454 174.545454z" p-id="2467"></path><path d="M500.363636 558.545455a35.141818 35.141818 0 0 1-24.669091-10.24 34.676364 34.676364 0 0 1 0-49.338182l418.909091-418.909091a34.909091 34.909091 0 0 1 49.338182 49.338182l-418.909091 418.909091a35.141818 35.141818 0 0 1-24.669091 10.24z" p-id="2468"></path><path d="M919.272727 139.636364h-186.181818a34.909091 34.909091 0 0 1 0-69.818182h186.181818a34.909091 34.909091 0 0 1 0 69.818182z" p-id="2469"></path><path d="M919.272727 325.818182a34.909091 34.909091 0 0 1-34.909091-34.909091v-186.181818a34.909091 34.909091 0 0 1 69.818182 0v186.181818a34.909091 34.909091 0 0 1-34.909091 34.909091z" p-id="2470"></path></svg></a>'

			let room_people_num = document.querySelectorAll('.room_people_num')
			room_people_num[0].innerHTML = '<span style= "font-weight: 700">观看人数：</span>' +
				cardLiveInfo.online

			let room_start_time = document.querySelectorAll('.room_start_time')
			room_start_time[0].innerHTML = '<span style= "font-weight: 700">开播时间：</span>' +
				cardLiveInfo.live_time

			let room_continued_time = document.querySelectorAll('.room_continued_time')
			room_continued_time[0].innerHTML = '<span style= "font-weight: 700">持续时间：</span>' +
				timeFn(cardLiveInfo.live_time)

			//修改直播画面卡片
			let bili_up_live_room_a = document.querySelectorAll('.bili-up_live_room_a')
			bili_up_live_room_a[0].href = 'https://live.bilibili.com/' + user.room_id

			let live_video = document.querySelectorAll('.live_video')
			await pausemix()
            console.log(liveInfoSrc.play_url.durl[0].url)
			flv = flvjs.createPlayer({
				type: 'flv',
				url: liveInfoSrc.play_url.durl[0].url,
				isLive: true, //数据源是否为直播流
				hasAudio: true, //数据源是否包含有音频
				hasVideo: true, //数据源是否包含有视频
				enableStashBuffer: false //是否启用缓存区
			}, {
				enableWorker: false, //不启用分离线程
				enableStashBuffer: false, //关闭IO隐藏缓冲区
				autoCleanupSourceBuffer: true, //自动清除缓存
			});
			flv.attachMediaElement(live_video[0]);
			flv.load();
			playPromise = flv.play();
			glider.refresh(true)

			let glider_track = document.querySelector('.glider-track')
			glider_track.style.width = '636px'

			let embla_slides = document.querySelectorAll('.embla_slide')
			embla_slides[0].style.width = '318px'
			embla_slides[1].style.width = '318px'

			//修改直播封面
			let user_cover = document.querySelectorAll('.user_cover')
			user_cover[0].src = cardLiveInfo.user_cover
		}

		//还原卡片信息
		async function reductionCardInfo(user, live_info_card, live_frame_card, sticky_card) {
			await pausemix()
			live_info_card.style.display = 'none'
			live_frame_card.style.display = 'none'
			sticky_card.style.position = 'sticky'
			sticky_card.style.top = '72px'
		}

		//访问用户名片信息
		function requestCardInfo(mid) {
			return new Promise((resolve, reject) => {
				GM_xmlhttpRequest({
					method: 'get',
					url: 'https://api.bilibili.com/x/web-interface/card?mid=' + mid +
						'&photo=true',
					onload: function(response) {
						let json = JSON.parse(response.responseText)
						resolve(json.data)
					}
				})
			})
		}

		//获取直播间信息
		function getLiveInfo(room_id) {
			return new Promise((resolve, reject) => {
				GM_xmlhttpRequest({
					method: 'get',
					url: 'https://api.live.bilibili.com/room/v1/Room/get_info?room_id=' +
						room_id,
					onload: function(response) {
						let json = JSON.parse(response.responseText)
						resolve(json.data)
					}
				})
			})
		}

		//估算数量
		function estimateNum(num) {
			if (num >= 10000) {
				let first = parseInt(num / 10000);
				let second = ((num % 10000) * 0.0001).toFixed(1);
				num = "";
				num = first + "." + second.substring(2) + "万";
			}
			return num;
		}

		//计算时间差
		function timeFn(time) {
			let dateBegin = new Date(time.replace(/-/g, "/"))
			let dateEnd = new Date()
			let dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
			let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
			let leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
			let hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
			//计算相差分钟数
			let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
			let minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数

			let calculationTime = ''
			/*= (dayDiff > 0 ? dayDiff + ':' : '') + (hours < 10 ? '0' + hours :
				hours) + ':' + (minutes < 10 ? '0' + minutes : minutes)*/
			if (dayDiff > 0) {
				calculationTime += dayDiff + '天'
			}
			if (hours > 0) {
				calculationTime += hours + '小时'
			}
			if (minutes > 0) {
				calculationTime += minutes + '分钟'
			}
			return calculationTime
		}

		//获取直播视频流
		function getLiveSrc(room_id) {
			return new Promise((resolve, reject) => {
				GM_xmlhttpRequest({
					method: 'get',
					url: 'https://api.live.bilibili.com/xlive/web-room/v1/index/getRoomPlayInfo?room_id=' +
						room_id + '&play_url=1&mask=1&qn=10000&platform=web',
					onload: function(response) {
						let json = JSON.parse(response.responseText)
						resolve(json.data)
					}
				})
			})
		}

		//销毁视频流
		function pausemix() {
			if (flv !== null) {
				if (playPromise !== undefined) {
					playPromise.then(_ => {}).catch(error => {});
				}
				flv.pause()
				flv.unload()
				flv.detachMediaElement()
				flv.destroy()
				flv = null
			}
		}
	}, 5000)
})();
