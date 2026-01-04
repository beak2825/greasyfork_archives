// ==UserScript==
// @name        atcoder-tasks-page-colorizer
// @namespace   https://twitter.com/kymn_
// @version     1.1.2
// @description tasksページにおいて、提出した問題に色付けを行います。
// @author      keymoon
// @license     MIT
// @supportURL  https://twitter.com/kymn_
// @match       https://atcoder.jp/contests/*/tasks
// @require     https://greasyfork.org/scripts/437862-atcoder-problems-api/code/atcoder-problems-api.js?version=1004082
// @downloadURL https://update.greasyfork.org/scripts/380404/atcoder-tasks-page-colorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/380404/atcoder-tasks-page-colorizer.meta.js
// ==/UserScript==

if (moment() < endTime) return;

$('#main-div thead th:last-child').before('<th width="10%" class="text-center">最終提出</th>');
getSubmissions(userScreenName).then(colorize);

function colorize(problems_info) {
	$('#main-div tbody tr').each((x,y) => {
		let problem_id = y.querySelector('td:nth-child(2) a').getAttribute('href').split('/').pop();
		let trial = problems_info.filter(x => x.problem_id == problem_id);
		colorize_row(y,trial);
	})

	function colorize_row(row, trial) {
		var submitted = trial.length != 0;
		var is_accepted = trial.map(x => x.result).includes('AC');
		var last_submit = !submitted ? null : trial.reduce((x,y) => x.epoch_second > y.epoch_second ? x : y);
		$(row.querySelector('td:last-child')).before(`<td class="text-center">${submitted ? `<a href="https://atcoder.jp/contests/${last_submit.contest_id}/submissions/${last_submit.id}">${moment.unix(last_submit.epoch_second).format("YYYY/MM/DD")}</a>` : '-'}</td>`);
		if(submitted) row.classList.add(is_accepted ? 'success' : 'warning');
    }
}
