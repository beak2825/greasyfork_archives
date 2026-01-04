// ==UserScript==
// @name         CF-virtual-pretest
// @version      0.1.1
// @description  Show only pretest result when participating in virtual contest in Codeforces
// @match        *://codeforces.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @namespace    https://greasyfork.org/users/410786
// @downloadURL https://update.greasyfork.org/scripts/393157/CF-virtual-pretest.user.js
// @updateURL https://update.greasyfork.org/scripts/393157/CF-virtual-pretest.meta.js
// ==/UserScript==


(function(){

	//OK:1,
	//COMPILATION_ERROR:1,
	//CRASHED:1, // example: https://codeforces.com/contest/566/submission/42421894
	//FAILED:1,  // example: https://codeforces.com/contest/566/submission/16877130

	/*
	const wrong_verdicts={
		WRONG_ANSWER:1,
		TIME_LIMIT_EXCEEDED:1,
		RUNTIME_ERROR:1,
		MEMORY_LIMIT_EXCEEDED:1,
		IDLENESS_LIMIT_EXCEEDED:1,

		0:0}*/

	const pretest_passed_verdicts={
		SKIPPED:1,
		CHALLENGED:1, // aka hacked

		0:0}

	function getPassedTestCount(x){
		return x.passedTestCount
	}

	//let csrf_token=Codeforces.getCsrfToken()
	//let csrf_token=document.getElementsByName('X-Csrf-Token')[0].content
	let csrf_token=undefined // TODO

	function parseCsrfToken(html){
		if(typeof(html)==='string')
			html=$.parseHTML(html)
		return html.find(z=>z.name=='X-Csrf-Token').content
	}

	let logged_out=false // When the user is taking part in a virtual contest, it
	// isn't possible to get submission result directly.

	async function isValid(submissionId){
		//return true; // HACK TODO 403 in virtual participation

		// Return whether a skipped submission has no
		// wrong answer/run time error/memory limit exceeded/etc. test case, excluding hacks (can
		// happen when the user cheated in the contest). Example
		// https://codeforces.com/contest/1221/submission/60879848.

		/*
		let data=$.post('//codeforces.com/data/submitSource',{
			submissionId: submissionId,
			csrf_token:Codeforces.getCsrfToken()
		})
		*/

		console.log('isValid',submissionId)
		const options={
			url: '//codeforces.com/data/submitSource',
			type:'post',
			data: {submissionId: submissionId},
			headers: {'X-Csrf-Token': csrf_token},
			dataType: 'json',
		}

		let data
		try{
			console.log('url = ',options)
			data=await $.ajax(options)
		}catch(e){
			/*
			if(e.status===403){
				const match=location.href.match('://codeforces.com/contest/(\\d+)')
				const url=match ? '://codeforces.com/contest/'+match[1]+'/my?force_get=1' : undefined
				document.body.innerHTML=(
					'Failed to load. If you are taking part in a virtual contest, please open ' +
					(match? `<a href="${url}">${url}</a>`: url) +
					' in an incognito window, then reload this page.'
				)
			}
			*/

			console.log('trying again with new csrf_token | error =',e)
			options.headers['X-Csrf-Token']=csrf_token=parseCsrfToken(await $.get('/'))
			console.log('new csrf=',csrf_token)
			try{
				data=await $.ajax(options)
			}catch(e){
				console.log('trying again after logging out | error =',e)
				options.headers['X-Csrf-Token']=csrf_token=parseCsrfToken(
					await $.ajax({
						type:'get',
						url:document.querySelector('[href$="logout"]').href,
						headers:{'X-Csrf-Token': csrf_token},
					}))
				logged_out=true
				console.log('new csrf=',csrf_token)
				try{
					data=await $.ajax(options)
				}catch(e){
					console.log('??? | error =',e)
					throw e
				}
			}
		}

		return Object.keys(data).filter(
			x=>x.startsWith('verdict#')&&data[x]!='OK'
		).length==0
	}

	function pretestCountFetched(contestId){
		const key='pretest_count_'+contestId
		return GM_getValue(key)!==undefined
	}

	async function getPretestCount(contestId){
		if(searchParams.has('mock_pretest_count'))
			return new Proxy({}, { get: _=>[10, 20] })

		const key='pretest_count_'+contestId
		{
			const stored_result=GM_getValue(key)
			if(stored_result!==undefined)
				return JSON.parse(stored_result)
		}

		console.log('aaa')
		const data=await (async function(url){
			// cache the GET requests for development purposes
			let data

			//data=GM_getValue('stored_api_get_'+url)
			//if(data!==undefined)
			//	return JSON.parse(data)

			data=await $.get(url)

			// compress data
			data.result=data.result.filter(x=>x.author.participantType=="CONTESTANT")
			console.log('length=',data.result.length)

			// NOT WORK - always exceed the quota
			//GM_setValue('stored_api_get_'+url, JSON.stringify(data))

			return data
		})('//codeforces.com/api/contest.status?contestId='+contestId+'&from=1&count=100000000')

		console.log('bbb')
		let result={} // {problemIndex /* A/B/C/... */: [minPretestCount, maxPretestCount]}
		for(const problemIndex of new Set(data.result.map(x=>x.problem.index))){
			let problemResult=data.result.filter(x=>
				x.problem.index==problemIndex&&
				x.author.participantType=="CONTESTANT"
			)
			let minPretestCount,maxPretestCount

			s1=problemResult.filter(x=>
				pretest_passed_verdicts[x.verdict]&&x.passedTestCount!=0
				// it's possible for SKIPPED submissions to have 0 tests passed when
				// the user submits the second solution before the first one is judged
			)
			s1.sort((a,b)=>b.passedTestCount-a.passedTestCount)
			if(s1.length!=0&&(await isValid(s1[0].id))){
				minPretestCount=maxPretestCount=s1[0].passedTestCount
			}else{
				minPretestCount=1+Math.max(...
					problemResult.filter(
						// x=>x.testset=="PRETESTS"&&wrong_verdicts[x.verdict]
						// cannot be "skipped" -> must fail on pretest
						x=>x.testset=="PRETESTS"
					).map(getPassedTestCount)
				)
				maxPretestCount=Math.min(...
					problemResult.filter(
						x=>x.testset=="TESTS"
					).map(getPassedTestCount)
				)
			}
			result[problemIndex]=[minPretestCount,maxPretestCount]
		}

		GM_setValue(key,JSON.stringify(result))
		console.log(result)

		if(logged_out){
			document.body.innerHTML='You are logged out. Please refresh the page.'
			location.reload()
		}

		return result
	}

	/*
	function getContestId(){
		return location.pathname.match('^/contest/(\\d+)')[1]
	}
	const contestId=getContestId()
	*/

	let searchParams=new URL(location).searchParams
	// always_show, reset_button, mock_pretest_count, force_get

	let cache={} // problemId -> result
	let cacheSubmissions={} // submissionId -> item
	let participantId // assume participantId is fixed

	/*
    function get_csrf_token(){ // use Codeforces.getCsrfToken()
        return csrf_token
    }
	*/

	if(location.href.match('://codeforces.com/contestRegistration/\\d*/virtual/true')){
		const contestId=location.href.match('://codeforces.com/contestRegistration/(\\d*)/virtual/true')[1]
		if(pretestCountFetched(contestId))
			return
		window.addEventListener('load',function(){
			if(!confirm('Do you want to prefetch the pretest count of this contest?')){
				alert("Note: the pretest will still be fetched inside the contest, and that may log you out. "+
					"If you don't want that to happen, you should disable the script.")
				return
			}
			const registerButton=document.querySelector('[value="Register for virtual participation"]')
			if(registerButton===null){
				$.jGrowl('Something unexpected happened. Please wait until "Done" is displayed before registering.')
			}else{
				registerButton.disabled=true
				registerButton.value="Fetching pretest data..."
			}
			getPretestCount(contestId).then(function(){
				$.jGrowl('Done! You can register now.')
				location.reload()
			})
		})
	}else if(searchParams.has('force_get')&&location.href.match('://codeforces.com/contest/\\d*/my')){
		console.log('force_get')
		window.addEventListener('load',function(){
			const contestId=location.href.match('://codeforces.com/contest/(\\d*)/my')[1]
			getPretestCount(contestId).then(function(){
				let url=new URL(location)
				url.searchParams.delete('force_get')
				document.body.innerHTML=`Done. Redirecting to <a href="${url}">${url}</a>...`
				location.href=url
			})
		})
	}else if(searchParams.has('always_show')||location.href.match('://codeforces.com/contest/\\d*/my')){
		console.log('start')
		function restoreAll(){
			observer.disconnect()
			document.querySelectorAll('span').forEach(function(t){
				if(t.__oldTextContent!==undefined){
					t.textContent=t.__oldTextContent
					t.className=t.__oldClassName
				}
			})
		}

		let button
		function clickResetButton(){
			restoreAll()
			if(searchParams.has('reset_button')){
				document.body.removeChild(button)
				button=undefined
			}
		}
		function createResetButton(){
			if(button===undefined){
				if(searchParams.has('reset_button')){
					button=document.createElement('button')
					button.innerHTML='Reset'
					button.onclick=clickResetButton
					document.body.appendChild(button)
				}
			}
		}

		let pendingNodes=[]
		let getPretestCountRunning=false
		let pretestCount={}

		function processPendingNodes(){
			let oldPendingNodes=pendingNodes
			pendingNodes=[]
			oldPendingNodes.forEach(processSpan)
		}

		const loadingText='Loading...'

		function processSpan(t){
			if(t.textContent==='Running') // before any test
				return
			console.log('processSpan',t.textContent)
			let modified=t.textContent===loadingText||t.textContent==='Pretest passed'||t.textContent.includes(' pretest ')

			if(!modified){
				t.__oldTextContent=t.textContent
				t.__oldClassName=t.className
			}

			let contestId,problemIndex
			{
				let tableRow=t
				console.log('tableRow=',tableRow)
				while(tableRow.tagName!='TR'){
					tableRow=tableRow.parentNode
					console.log('tableRow=',tableRow)
					if(tableRow===null){
						console.log('??? not added to document?')
						return
					}
				}
				const problemUrl=tableRow.children[3].children[0].href
				const match=problemUrl.match('/contest/(\\d*)/problem/(.*)$$$')||problemUrl.match('/problemset/problem/(\\d*)/(.*)$$$')
				// the second format is only used in problemset status page (when always_show is on)
				contestId=match[1]
				problemIndex=match[2]
			}

			if(pretestCount[contestId]===undefined||pretestCount[contestId]==='running'){
				t.textContent=loadingText
				t.className=''
				pendingNodes.push(t)

				if(pretestCount[contestId]!=='running'){
					getPretestCount(contestId).then(function(result){
						pretestCount[contestId]=result
						processPendingNodes() // for pages different from contest/my this may cause the span to be push back to pendingNodes list
					})
					pretestCount[contestId]='running'
				}
				return
			}

			if(['Accepted','Happy New Year!'].includes(t.__oldTextContent)){
				createResetButton()
				t.textContent='Pretest passed'
				t.className=t.__oldClassName
				return
			}

			t.classList.replace('verdict-accepted','verdict-rejected')

			if(!(
				t.__oldClassName.match(/\bverdict-rejected\b/)||
				t.__oldClassName.match(/\bverdict-waiting\b/)
			)) throw new Error


			try{
				let wrongTestIndex=t.__oldTextContent.match(/ on test (\d+)$/)[1]
				if(wrongTestIndex<=pretestCount[contestId][problemIndex][0]){
					t.textContent=t.__oldTextContent.replace('on test','on pretest')
					t.className=t.__oldClassName // rejected || waiting
				}else if(wrongTestIndex<=pretestCount[contestId][problemIndex][1]){
					t.textContent='???'
					t.className=''
				}else{
					t.textContent='Pretest passed'
					t.className='verdict-accepted'
				}
			}catch(e){
				console.log(t.__oldTextContent,e)
			}

			//let problemId=tableRow.children[3].getAttribute('data-problemId') // int-parseable string
			//let submissionId=parseInt(tableRow.children[0].textContent)

			//if(participantId===undefined)
			//	participantId=parseInt(tableRow.children[2].getAttribute('data-participantId'))
		}

		let observer=new MutationObserver(function(mutations, observer){
			for (let r of mutations){
				for (let t of r.addedNodes){ // t must be in local scope
					if(t.tagName==='SPAN'){
						// t.classList.contains('contest-state-phase') // 'Contest is running' | 'Finished'
						if(t.classList.contains('contest-state-regular')&&!t.classList.contains('countdown')){
							console.log('contest-state = ',t,t.textContent)
							if(
								t.querySelector('.toggle-favourite')===null&&
								t.textContent!=='Virtual Participation' // | 'Practice' | '???'
								&&!searchParams.has('always_show')
							){
								console.log('bad state')
								clickResetButton()
								observer.disconnect()
								return
							}
						}else if(t.classList.contains('verdict-accepted')||t.classList.contains('verdict-rejected')||t.classList.contains('verdict-waiting')){
							processSpan(t)
						}
					}else if(t.tagName==='DIV'){
						// jGrowl
						if(t.classList.contains('jGrowl-notification')){
							let z=t.getElementsByClassName('message')
							if(z.length!==0&&
								z[0].textContent.match(/^Accepted$| on test \d+$/)
							)
								z[0].textContent='???'
						}
					}
				}
			}
		})

		observer.observe(document,{
			childList:true,
			subtree:true,
			attributes:true
		});
	}
})()


// TODO incomplete (rewrite standings table)

// vim: set ts=4 sw=4 fdm=indent: