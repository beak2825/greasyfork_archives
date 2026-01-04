
// observe module start

const {wykopObserve, filterGroups, loginUser, getAdjacentEls} = (function () {

	const headerProfileElement = "header-profile-element";
	const linkPageAuthorElement = "link-page-author-element"; // element osoby która dodała ten link
	
	const mikroblogPageComment = "mikroblog-page-comment";
	const mikroblogPageSubComment = "mikroblog-page-sub-comment";
	const linkPageComment = "link-page-comment";
	const linkPageSubComment = "link-page-sub-comment";
	const wpisPageComment = "wpis-page-comment";
	const wpisPageSubComment = "wpis-page-sub-comment";
	const tagPageComment = "tag-page-comment";
	const tagPageSubComment = "tag-page-sub-comment";
	const mojPageComment = "moj-page-comment";
	const mojPageSubComment = "moj-page-sub-comment";
	
	const mikroblogPageWriteElement = "mikroblog-page-write-element";
	const linkPageWriteElement = "link-page-write-element";
	const wpisPageWriteElement = "wpis-page-write-element";
	const tagPageWriteElement = "tag-page-write-element";
	const ludziePageWriteElement = "ludzie-page-write-element";
	const mojPageWriteElement = "moj-page-write-element";
	
	const ludziePageLinkSubComment = "ludzie-page-link-sub-comment";
	const ludziePageWpisComment = "ludzie-page-wpis-comment";
	const ludziePageWpisSubComment = "ludzie-page-wpis-sub-comment";
	
	const glownaPageComment = "glowna-page-comment";
	
	const mikroblogLinkWpisGlownaTagMojComment = [
		mikroblogPageComment,
		linkPageComment,
		wpisPageComment,
		glownaPageComment,
		tagPageComment,
		mojPageComment,
	];
	
	const mikroblogLinkWpisTagSubMojComment = [
		mikroblogPageSubComment,
		linkPageSubComment,
		wpisPageSubComment,
		tagPageSubComment,
		mojPageSubComment,
	];
	
	const mikroblogLinkWpisGlownaTagMojCommentOrSubComment = [
		...mikroblogLinkWpisGlownaTagMojComment,
		...mikroblogLinkWpisTagSubMojComment,
	];
	
	const ludziePageCommentOrSubComment = [
		ludziePageLinkSubComment,
		ludziePageWpisComment,
		ludziePageWpisSubComment
	]
	
	const writeElement = [
		mikroblogPageWriteElement,
		linkPageWriteElement,
		wpisPageWriteElement,
		tagPageWriteElement,
		ludziePageWriteElement,
		mojPageWriteElement,
	];
	
	const places = [
		headerProfileElement,
		linkPageAuthorElement,
		
		mikroblogPageComment,
		mikroblogPageSubComment,
		linkPageComment,
		linkPageSubComment,
		wpisPageComment,
		wpisPageSubComment,
		tagPageComment,
		tagPageSubComment,
		mojPageComment,
		mojPageSubComment,
		
		mikroblogPageWriteElement,
		linkPageWriteElement,
		wpisPageWriteElement,
		tagPageWriteElement,
		ludziePageWriteElement,
		mojPageWriteElement,
		
		
		ludziePageLinkSubComment,
		ludziePageWpisComment,
		ludziePageWpisSubComment,
		
		glownaPageComment,
		
		
		//"chat-page-comment",
		//"chat-page-write-element",
		
		//"own-page-author-element", // element osoby która utworzyła własną treść w edytorze wykopowym
	];
	
	const otherFilter = "other";
	
	
	const getWykopPageType = ()=>location.pathname.split("/")[1];
	const hasSub = (profileEl)=>profileEl.parentElement.parentElement.parentElement.classList.contains("sub");
	const getSub = (profileEl)=>hasSub(profileEl)?"-sub":"";
	
	
	function getProfiles (scopeEl, placesFilter) {
		const profiles = [];
		
		const loggedUserEl = document.querySelector('.logged-user > a');
		if (loggedUserEl && placesFilter.includes(headerProfileElement)) {
			profiles.push(loggedUserEl);
		}
		
		const userCardEl = document.querySelector('.usercard > a');
		if (getWykopPageType() === "link" && userCardEl && placesFilter.includes(linkPageAuthorElement)) {
			profiles.push(userCardEl);
		}
		
		// UWAGA: to filtruje tylko wstępnie. później filtruje się pojedynczo w observer
		
		//if (getWykopPageType() === "mikroblog" && placesArr.includes(mikroblogPageComment)) {
			//profiles.push(...Array.from(scopeEl.querySelectorAll('[data-type="entry"] .profile')));
		//}
		//if (getWykopPageType() === "mikroblog" && placesFilter.includes(mikroblogPageSubComment)) {
			profiles.push(...Array.from(scopeEl.querySelectorAll('[data-type="entrycomment"] .profile')));
		//}
		if (getWykopPageType() === "link" && placesFilter.includes(linkPageComment)) {
			profiles.push(...Array.from(scopeEl.querySelectorAll(':not(.sub) [data-type="comment"] .profile')));
		} // nie odkomentowywać, bo dam się dynamicznie nie aktualizują ani nie doładowują ukryte, bo one są tylko hidden.
		if (getWykopPageType() === "link" && placesFilter.includes(linkPageSubComment)) {
			profiles.push(...Array.from(scopeEl.querySelectorAll('.sub [data-type="comment"] .profile')));
		}
		//if (getWykopPageType() === "wpis" && placesArr.includes(wpisPageComment)) {
			//profiles.push(...Array.from(scopeEl.querySelectorAll('[data-type="entry"] .profile')));
		//}
		//if (getWykopPageType() === "wpis" && placesFilter.includes(wpisPageSubComment)) {
			profiles.push(...Array.from(scopeEl.querySelectorAll('[data-type="entrycomment"] .profile')));
		//}
		//if (getWykopPageType() === "tag" && placesArr.includes(tagPageComment)) {
			//profiles.push(...Array.from(scopeEl.querySelectorAll('[data-type="entry"] .profile')));
		//}
		//if (getWykopPageType() === "tag" && placesFilter.includes(tagPageSubComment)) {
			profiles.push(...Array.from(scopeEl.querySelectorAll('[data-type="entrycomment"] .profile')));
		//}
		//if (getWykopPageType() === "moj" && placesFilter.includes(mojPageSubComment)) {
			profiles.push(...Array.from(scopeEl.querySelectorAll('[data-type="entrycomment"] .profile')));
		//}
		
		if (getWykopPageType() === "mikroblog" && placesFilter.includes(mikroblogPageWriteElement)) {
			profiles.push(...Array.from(scopeEl.querySelectorAll('[data-submitflag="commentSubmit"] .profile')));
		}
		if (getWykopPageType() === "link" && placesFilter.includes(linkPageWriteElement)) {
			profiles.push(...Array.from(scopeEl.querySelectorAll('[data-submitflag="commentSubmit"] .profile')));
		}
		if (getWykopPageType() === "wpis" && placesFilter.includes(wpisPageWriteElement)) {
			profiles.push(...Array.from(scopeEl.querySelectorAll('[data-submitflag="commentSubmit"] .profile')));
		}
		if (getWykopPageType() === "tag" && placesFilter.includes(tagPageWriteElement)) {
			profiles.push(...Array.from(scopeEl.querySelectorAll('[data-submitflag="commentSubmit"] .profile')));
		}
		if (getWykopPageType() === "ludzie" && placesFilter.includes(ludziePageWriteElement)) {
			profiles.push(...Array.from(scopeEl.querySelectorAll('[data-submitflag="commentSubmit"] .profile')));
		}
		if (getWykopPageType() === "moj" && placesFilter.includes(mojPageWriteElement)) {
			profiles.push(...Array.from(scopeEl.querySelectorAll('[data-submitflag="commentSubmit"] .profile')));
		}
		
		if (getWykopPageType() === "ludzie" && placesFilter.includes(ludziePageLinkSubComment)) {
			profiles.push(...Array.from(scopeEl.querySelectorAll(':not(.sub) [data-type="comment"] .profile')));
		}
		//if (getWykopPageType() === "ludzie" && placesArr.includes(ludziePageWpisComment)) {
			profiles.push(...Array.from(scopeEl.querySelectorAll('[data-type="entry"] .profile')));
			// bez if-a, żeby observer się dodał, a filtrowane w observer-ze i w allFn
			// reszta zapytań [data-type="entry"] .profile za-komentowana, żeby nie powielać.
			// glownaPageComment też
		//}
		//if (getWykopPageType() === "ludzie" && placesFilter.includes(ludziePageWpisSubComment)) {
			profiles.push(...Array.from(scopeEl.querySelectorAll('[data-type="entrycomment"] .profile')));
		//}
		
		
		if (profiles.length===0) { console.log("profiles is empty"); }
		return profiles;
	}
	
	function getPlace (profileEl) {
		let place = "other";
		if (profileEl === document.querySelector('.logged-user > a')) {
			place = headerProfileElement;
		} else
		if (getWykopPageType() === "link" && profileEl === document.querySelector('.usercard > a')) {
			place = linkPageAuthorElement;
		} else
		if (getWykopPageType() === "ludzie" && profileEl.parentElement.matches('[data-type="comment"]')) {
			place = ludziePageLinkSubComment;
		} else
		if (getWykopPageType() === "ludzie" && profileEl.parentElement.matches('[data-type="entry"]')) {
			place = ludziePageWpisComment;
		} else
		if (getWykopPageType() === "ludzie" && profileEl.parentElement.matches('[data-type="entrycomment"]')) {
			place = ludziePageWpisSubComment;
		} else
		if (getWykopPageType() === "ludzie" && profileEl.parentElement.matches('[data-submitflag="commentSubmit"]')) {
			place = ludziePageWpisSubComment;
		} else
		if (document.querySelector(".grid .info")?.textContent?.includes("Strona główna")
				&&
				profileEl.parentElement.matches('[data-type="entry"]')) {
			place = glownaPageComment;
		} else
		if (["ludzie","link","tag","mikroblog","wpis","moj"].includes(getWykopPageType())) {
			place = `${getWykopPageType()}-page${getSub(profileEl)}-comment`;
		}
		
		if (place === "") { console.log("place null", profileEl); }
		return place;
	}
	
	function getProfileElNick(profileEl) {
		const nickB = profileEl.getAttribute("href").split("/");
		const nick = nickB[nickB.length-2];
		return nick;
	}
	
	const getSex = avatarEl=>avatarEl.classList.contains("male")?"male":avatarEl.classList.contains("female")?"female":null;
	
	async function wykopObserve (userFilters, callbackFn, {once=false,delay=null}) {
	
	const cleanP = [...(new Set(userFilters.flat(Infinity)))];
	userFilters = cleanP.filter(p=>[...places, otherFilter].includes(p));
	const ff = cleanP.filter(p=>![...places, otherFilter].includes(p));
	if (ff.length>0) { console.warn(`[WykopObserve] faulty filters: ${ff.map(f=>`"${f}"`).join(", ")}.`); }
	const sym = Symbol();
	
	
	function getAttrs (profileEl) {
		const avatarEl = profileEl.querySelector(".avatar");
		
		const place = getPlace(profileEl);
		const isFirstTime = profileEl.parentElement.parentElement[sym]!==true;
		const nick = getProfileElNick(profileEl);
		const authorSex = getSex(avatarEl);
		const attrs = {place, isFirstTime, nick, authorSex};
		return attrs;
	}
	function getElements (profileEl) {
		const liEL = profileEl.parentElement.parentElement;
		return {
			profileEl,
			liEl: liEL.matches("li")?liEL:null,
			contentEl: profileEl.parentElement.querySelector(".text > p")
		};
	}
	
	async function cbFn (elements, attrs) {
		await callbackFn(elements, attrs);
		//if (delay >= 0) { await delayFn(delay); }
	}
	
	function addCommentOrSubCommentChangeObserver (cbFn, parentProfileEl, placesFilter) {
		const profileElObserver = new MutationObserver((mutations)=> {
			//console.log("profilEl mutation");
			const target = mutations[0].target;
			if (!(target instanceof HTMLElement)) { return false; }
			const profileEl = target.querySelector(".profile");
			const attrs = getAttrs(profileEl);
			const elements = getElements(profileEl);
			if (placesFilter.includes(attrs.place)) {
				cbFn(elements, attrs);
			}
		});
		profileElObserver.observe( parentProfileEl.parentElement.parentElement, {childList: true} );
	};
	
	async function cbAndObserveChanges (scopeEl, observe=true) {
		const placesFilter = userFilters;
		const profiles = getProfiles(scopeEl, placesFilter);
		
		for (const profileEl of profiles) {
			
			const attrs = getAttrs(profileEl);
			const elements = getElements(profileEl);
			if (placesFilter.includes(attrs.place) && (observe===false || once === false || attrs.isFirstTime === true)) {
				await cbFn(elements, attrs);
				if (observe) { addCommentOrSubCommentChangeObserver(cbFn, profileEl, placesFilter); }
				profileEl.parentElement.parentElement[sym] = true;
			}
			
			// addCommentOrSubCommentChangeObserver
			// trzeba dodać do każdego Comment i SubComment, bo to obserwuje modyfikację konkretnego elementu pod względem posiadania
			// 	brody. nie sprawdza ilości a modyfikację elementu (np. usunięcie, edycję).
			// obsługuje: usunięcie(stan "usunięty"), stan edycji(jak jest pole do wpisywania to też odświeża avatar), stan po edycji.
			// modyfikacja WpisPageComment też trigger-uje observera.
		}
		
	}
	
	
	
	function addSubObserver (subOrStreamEl, callback=()=>{}) {
		//if (subOrStreamEl.dataset.hasOwnProperty("childCount")) { return false; }
		if (subOrStreamEl[sym]===true) { return false; }
		//subOrStreamEl.dataset.childCount = `${subOrStreamEl.childElementCount}`;
		const subObserver = new MutationObserver(async function(mutations) {
			const target = mutations[0].target;
			if (!(target instanceof HTMLElement)) { return false; }
			//target.dataset.childCount = `${target.childElementCount}`;
			await cbAndObserveChanges(target);
			callback();
		});
		subObserver.observe( subOrStreamEl, {childList: true} );
		subOrStreamEl[sym]=false;
	};
	
	function observeExpandSubComments () {
		const subEls = Array.from( document.querySelectorAll(".sub") );
		subEls.forEach((subEl)=>addSubObserver(subEl));
	}
	
	function cbAndObserveOnNewAndInfiniteScrollInTagPage () {
		const streamEl = document.querySelector(".comments-stream");
		addSubObserver(streamEl, observeExpandSubComments);
	}
	
	
	await cbAndObserveChanges(document);
	// dodaje do wpisPageComment lub wpisPgeSubComment i obserwuje modyfikacje
	// nie reaguje na ładowanie dodatkowych postów w tagu.
	
	observeExpandSubComments();
	// dodaje dla wpisPageSubComment, gdy rozwinąć dodatkowe zwinięte komentarze wpisPageSubComment
	// w link, mikroblog, na profilu też działa doładowywanie. (w link niepotrzebne właściwie)
	
	cbAndObserveOnNewAndInfiniteScrollInTagPage();
	// dodaje dla tagPageComment, doładowane jako nowe albo z infinite scroll
	// nie dodaje observer dla expandSubComments
	
	const refresh = ()=>cbAndObserveChanges(document, false);
	return {refresh};
	
	// const wpisZeroObserver = new MutationObserver(async function(mutations) {
	// 	const liEl = mutations[0].target;
	// 	if (!(liEl instanceof HTMLElement)) { return false; }
	// 	const subEl = liEl.querySelector(".sub");
	// 	if (!(subEl instanceof HTMLElement)) { return false; }
		
	// 	if (!(liEl.childElementCount !== 1 && subEl)) { return false; }
		
	// 	await cbAndObserveChanges(subEl);
	// 	subEl.dataset.childCount = `${subEl.childElementCount}`;
	// 	addSubObserver(subEl);
	// });
	// function subZeroFn () {
	// 	const streamElChildren = Array.from( document.querySelector(".comments-stream").children );
		
	// 	streamElChildren.forEach((liEl)=>{
	// 		if (!(liEl.childElementCount === 1)) { return false; }
	// 		wpisZeroObserver.observe( liEl, {childList: true} );
	// 	});
	// }
	//subZeroFn();
	// raczej nic nie robi
	// dodaje dla wpisPageSubComment ale setNowAndObserveChanges też to robi?
	// nie dodaje gdy zmienia się liczba wpisPageSubComment
	// nie dodaje, gdy rozwinąć dodatkowe zwinięte komentarze wpisPageSubComment
	
	
	}
	
	function getLogin () {
		const avatarEl = document.querySelector(".logged-user img.avatar");
		if (!(avatarEl instanceof HTMLImageElement)) { return false; }
		return {login:avatarEl.alt, sex:getSex(avatarEl)};
	}
	
	function getAdjacentEls(liEl) {
		return liEl?.parentElement?.children||[];
	}
	
	//} // observe lib end
	
	return {wykopObserve, loginUser:getLogin(), getAdjacentEls, filterGroups: {
		all: places,
		mikroblogLinkWpisGlownaTagMojComment,
		mikroblogLinkWpisTagSubMojComment,
		mikroblogLinkWpisGlownaTagMojCommentOrSubComment,
		ludziePageCommentOrSubComment,
		writeElement,
	}};
	
	})();
	// observe module end
