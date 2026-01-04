/*
// ==UserScript==
// @namespace   com.whoopsworkshop.hkgsherlock.userjs.pixiv_bookmark_async
// @id          com.whoopsworkshop.hkgsherlock.userjs.pixiv_bookmark_async
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAAAA3NCSVQICAjb4U/gAAAAYnpUWHRSYXcgcHJvZmlsZSB0eXBlIEFQUDEAAHicVcixDYAwDADB3lN4hHccHDIOQgFFQoCyf0EBDVee7O1so696j2vrRxNVVVXPkmuuaQFmXgZuGAkoXy38TEQNDyseBiAPSLYUyXpQ8HMAAAUhSURBVFiF7ZltbBRFHMafmd29Xq9vh32lFNsCpYS38CZqFYtBG1FD0Eg0qBGNQQJBEZSgX/xmbUJCCKJGQxASEzQBCyRFECKQkFSFtOUKpWdbELgXoC29tne9u92d8cOVsne97W4LS/zAk/tyz8zO/G7mPzP/nSP46iiSSQSKbQJLWnZvUjiuyapeqaj7GNAe1X3MOtEH3+XIeghkpIdARtJdZcnFAcbBOHjsoykiBBSgBJSCWA3EOFQGhUEU3i4dN2981uTstNwMe6ZdEgXKOQ9GlM7+yJXu4Flvzw9tXZBVSAKEsZARvY1xUApDRFlUmLl6blFlWf7ER9LMNNp+s7f2vOeT+n/BOSRhVFg6QByQVTBeU1HyzuOl+ZmpCeVd/WFfYKA7FGWMO2xCXkZqSU768GZ+Pnvljd9aQAhEs8GaDEhWwbFrSdl7FVO0dlhWjzR7Drb497R1QuWg5O5PZxyMvzY5e9W8iS/NKor7aRwf7j/3tcsPhzR6IMYRkqsXlW5+fjoldwfaHxj48njLjibvYGQIOnPAOGQVIq1bNmvpzAnakoONV5cfOI8022iAIspj2Y7aNxcWOh3aGtv/uLThxD9wSBDMDTsHBuRV5bm7Vy7U2vUdt57c/SfSDZjoYBP90Z2VU/5atziBBsCOJi/SbWZpABDAIf3Y0bX4u9Na+4lJuYdXzEFINgJiHLLqWvPU2sqpMYvzuBpp5lG0koRTncH39/2t9V6eXbRpTiGUkZIaOjFF7Pv0uZkTxsW+1xy70Oy5PRaCZEy7Wm7+ftGr9ba+Mhcc4HrPgLrXL063D8b/lkNNW0602SXh/gABSJWqal0J3k9V5dBP0OhQ99VHL9Q0eEwuTrMigKIeafZovZULS6HqztpgfJxs9X9+5jLsozzazEgSdp29muBtmD1ej4kCUBl/9pcGOIw3ibGIkv2XuxO8F8rzoSSPI3o7FBUogcrv5Yg2ECFtN3u1xoxCJ5jOCG062AjAQhoAFJ6ekNYodDr0Fhrd3dEt1hxDigXRMyRC+sJx+yElBDT5GFCIVOUWj9BoRAHraTjPSh22YphOUFvMMtj3o/GZnbcnpDcKDwSIkuLsuPTN5bkNmrxr64EUtnHW+ATv8EU/RL2gtloR5YOKSVpDVtnOZr9ePmMxkMLeKs+dmp+l9b497Yak26+VQBxg/PsVC7ReTyj60cl26CcUlgFxIBRtXV2Raovre/ne+pGPcGMghetnU3pSGaLKpbWLEiZr44GGU7eCenu0WaCyjBSEZCgsMbfVQwlGXy9yBrdUlRfE0WyubdzW7IPNIPszPsJq361w3wj82nR9u8vnC4QhUFACQkDubPEc4ByMQ2GrpuVtqiwbSohjiijqq3vq67y9Zk7MYS+KYcW95umy/MyktfvCstsfuNId9AQGOkPRUFRlnKeniMVOx4yCrAWlOeKw6TjcdG3ZoWYIxOR7izHyN6fdVdMKpuRlAsiwS/NLcuaX5Jhpus51ff3x1o7eCFJE88elMdDWc9fXHXfDYftsRv4zpTkzC51F+lcOXf3hhqvdda03trl8AGATRpsWG9fOEGks868+76tu9EJl4JjstM8Z58hLk9JEIcp4IKK0BcJnbgWhMggUIhlzgmX6MYI7NxgCgPaI0u7r1aw7AgKkCLHSe9FYE8XYKrMgk/rf3TE+BDKSMRAf4WbAAsUDMY4BmcRHap/C8AD/hdEAMb68IKPni6WxTXlIlz9esu/F6SPcV9xf/QdhL+PXM2v0PQAAAABJRU5ErkJggg==
// @name        Pixiv Bookmark async
// @version     201709211745+8
// @author      hkgsherlock
// @license     Unlicense
// @description Add a bookmark in Pixiv on background using Fetch API.
// @include		/^https?:\/\/www\.pixiv\.net\/member_illust\.php?.*mode=(medium|manga).*$/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/33342/Pixiv%20Bookmark%20async.user.js
// @updateURL https://update.greasyfork.org/scripts/33342/Pixiv%20Bookmark%20async.meta.js
// ==/UserScript==
*/

const PIXIV_API_URL = 'https://www.pixiv.net/rpc/index.php';
const BUTTON_TARGET_QUERY = '.bookmark-container .add-bookmark';

(() => {
	const target = document.querySelector(BUTTON_TARGET_QUERY);

	target.addEventListener('click', (e) => {
		e.preventDefault();

		const queryString = document.location.search.substr(1)
			.split('&')
			.map((e) => {
				const [key, value] = e.split('=');
				return {[key]: value};
			})
			.reduce((a,b)=>Object.assign(a,b),{});
		
		// https://google.com/search?q=pixiv+context+token
		const pixiv_context_token = window.pixiv.context.token;  // not ranbu sry (; _ ;) i miss my manba-chan dayo~
		const illust_id = queryString.illust_id;
		const restricted = !!document.querySelector('.work-info .meta [class^="r-18"]');
		const comment = null;
		const tags = [...document.querySelectorAll('.tags .tag .text')].map((e) => e.innerText).join('+');

		fetch(PIXIV_API_URL, {
			method: "POST",
			headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
			},
  			credentials: "same-origin",
			body: [
				'mode=save_illust_bookmark',
				`illust_id=${illust_id}`,
				`restrict=${!!restricted?1:0}`,
				'comment'+(!!comment?`=${comment}`:''),
				'tags'+(!!tags?`=${tags}`:''),
				`tt=${pixiv_context_token}`,
			].join('&'),
		})
			.then((r) => r.json())
			.then((data) => {
				if (data.error) throw new Error(message || body.message);
				document.querySelector(BUTTON_TARGET_QUERY)
					.replaceWith(((id) => {
						const a = document.createElement('a');
						a.setAttribute('href', `bookmark_add.php?type=illust&illust_id=${id}`);
						a.classList.add('_bookmark-toggle-button');
						a.classList.add('bookmarked');
						a.classList.add('edit-bookmark');
						a.appendChild((() => {
							const span = document.createElement('span');
							span.classList.add('description');
							span.innerText = "ブックマークを編集";
						    return span;
						})());
						a.appendChild((() => {
							const span = document.createElement('span');
							span.setAttribute('style', 'animation:nice-zoom-smile 1s forwards cubic-bezier(0.9, -1.5, 0.4, 1);'
								+'position:absolute;'
								+'top:50%;'
								+'left:50%;'
								+'width:32px;'
								+'height:32px;'
								+'margin:-16px 0 0 -16px;'
								+'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAACdklEQVRIibWVXUhTcRiHHzaUOVysLJouI9MIv8gpmjbdzrmRidAExQjMWuTAqJAwKBTXhYWYSQol3WSzEgzsYwmK83PdZBeBhhKG0MdFpl0oGRna7GJbmGme6frB/+q87/Oc856Xc8C/aIFwP3skRwYUeI/sfwhiTx2OsJWYI6qA+EDDgxVB8uOTjszxqY7MCUWQ3AIoAinQN5Xvv+V2iUtul7jUfDG2CTAECq42HFBXzjmNr32C+V7hTXbaNhuwIxCC3K5rSXYf3HcGGnWtQJ6/sCA8q6gDsoFis357+eKgsLBS4HaJS8dMOy8Bxd5anbc3eCV0D555FsRoQ8pK87SVLRVxDcP21PY5p2HY7RJ/rgb/Pa4e48jI3bTHD2xxDaV52soYbUgZnlUWgCjwzNEy2Jh83+0SV71TP8/CQKPODliAMN9TaIUk9eXJp/q+zQo+O/S9Yoq6yjuuPxJt1oddmek0DG0UPttlGDIbwqqB6LVecuIJk6Z2zmkY9Rc+32scPZmrqQES19ukjPNHI6//6Dd+kApfHBTfXzgSWQdkrAf3xfSsJuGv3V/r9N3Q2QGTVDiA8PxmcptUwYvbKQ/xrKXk5Iy2HOySKphoS+8GcvwR5H98dOilVMGUI+sVkO+PoGi22/huOeSb0zjz5GrCnfbq+Oav3cYvy6997xOmgSKpcBlg9TVPd2SN15+NqVMp5VZABASVUl5Se3pv/SdH5pivLlQpK0Xin04VFa6wvm1N7z9TsMuG52OWBiiX1SiBVKDYkhteMXYvvUe3L/QcoJIi0ABWoBCIBeT/qJV7awq9PRopgi1ApJTCFdkNbN1A3+byC5PVP0NhP2rsAAAAAElFTkSuQmCC);'
								+'background-position:center;'
								+'background-repeat:no-repeat;'
								+'background-size:cover;'
								+'visibility:hidden;');
						    return span;
						})());
						return a;
					})(illust_id));
			})
			.catch((err) => console.error(err));
	});

	target.querySelector('.description').textContent += '*';
})();