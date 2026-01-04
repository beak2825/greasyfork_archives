// ==UserScript==
// @name         CF-problem-score-table
// @version      0.0.1
// @description  Add the "score table" to Codeforces in practice/virtual contest
// @match        *://codeforces.com/contest/*
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace    https://greasyfork.org/users/410786
// @downloadURL https://update.greasyfork.org/scripts/394237/CF-problem-score-table.user.js
// @updateURL https://update.greasyfork.org/scripts/394237/CF-problem-score-table.meta.js
// ==/UserScript==


(async function(){
	const contestId=location.pathname.match('^/contest/(\\d+)')[1]
	let problems

	// stored value: [] for educational rounds, list of [index, points] otherwise
	if(GM_getValue('problem_score_'+contestId)!==undefined){
		problems=JSON.parse(GM_getValue('problem_score_'+contestId))
		if(problems.length>0&&problems[0][1]===null){ // fix a bug in previous version
			problems=[]
			GM_setValue('problem_score_'+contestId,JSON.stringify(problems))
		}
	}else{
		const data=await $.get(`/api/contest.standings?contestId=${contestId}&from=1&count=1`)
		if(data.status!=='OK'){
			console.log('Failed: ',data)
			return
		}
		problems=[]
		for(let problem of data.result.problems){
			if(!('points' in problem)){ // educational contest
				break
			}
			problems.push([problem.index,problem.points])
		}
		problems.sort()
		GM_setValue('problem_score_'+contestId,JSON.stringify(problems))
	}
	if(problems.length==0)
		return

	//let lastDark=problems.length%2!=0 // more consistent with Codeforces (according to
	// http://web.archive.org/web/20160123153752/http://codeforces.com/contest/617), but is not as beautiful
	// because the header row is light.

	let lastDark=false

	function lastDarkState(){
		return lastDark?'dark':''
	}
	function nextDarkState(){
		lastDark=!lastDark
		return lastDarkState()
	}

	// Thanks to the Internet Archive, I could get the "score table" HTML source without waiting for a real
	// contest. I just go to http://web.archive.org/web/*/https://codeforces.com/contest/*, then filter by
	// 'contest/' and sort by unique.
	// The page with the maximum unique count must have the score table.
	//
	// Taken from page: http://web.archive.org/web/20151230151115/http://codeforces.com/contest/611
	// (or http://web.archive.org/web/20160123153752/http://codeforces.com/contest/617 for Russian version)
	//
	// Currently only English is supported, but it's trivial to add the Russian version.

	let problemsHTML=String.raw`
		<div class="roundbox sidebox" style="">
			<div class="roundbox-lt">&nbsp;</div>
			<div class="roundbox-rt">&nbsp;</div>
			<div class="caption titled">→ Score table
				<div class="top-links">
				</div>
			</div>
			<table class="rtable ">
				<tbody>
					<tr>
								<th class="left" style="width:100%;"></th>
								<th class="" style="width:8em;">Score</th>
					</tr>
		`
	for(let [index,score] of problems){
		problemsHTML+=String.raw`
					<tr>
								<td class="left ${nextDarkState()}"><a href="/contest/${contestId}/problem/${index}">Problem ${index}</a></td>
								<td class=" ${lastDarkState()}">${score}</td>
					</tr>
		`
	}

	problemsHTML+=String.raw`
					<tr>
								<td class="left  ${nextDarkState()}"><span style="color:green;">Successful hack</span></td>
								<td class=" ${lastDarkState()}">100</td>
					</tr>
					<tr>
								<td class="left ${nextDarkState()}"><span style="color:red;">Unsuccessful hack</span></td>
								<td class="${lastDarkState()}">-50</td>
					</tr>
					<tr>
								<td class="left ${nextDarkState()}"><span style="color:black;">Unsuccessful submission</span></td>
								<td class="${lastDarkState()}">-50</td>
					</tr>
					<tr>
								<td class="left bottom ${nextDarkState()}"><span style="color:black;">Resubmission</span></td>
								<td class="bottom ${lastDarkState()}">-50</td>
					</tr>
				</tbody>
			</table>
		</div>
		`

	$('#sidebar').append(problemsHTML)
	$('#sidebar').append(String.raw`
		<div style="text-align:right; position:relative;bottom:1.75em;">
			<span class="small" style="color:gray;">* If you solve problem on 00:00 from the first attempt</span>
		</div>
		`)

})()
