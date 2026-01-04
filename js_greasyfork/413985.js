// ==UserScript==
// @name         Edpuzzle+
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://edpuzzle.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413985/Edpuzzle%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/413985/Edpuzzle%2B.meta.js
// ==/UserScript==

if (document.location.href.search("edpuzzle.com/assignments/") != -1 && document.location.href.search("edpuzzle.com/media/") != -1) {
	alert("You aren't on a edpuzle assignment. If you think this is an error please DM East_Arctica#9238 on discord!")
	throw new Error("You aren't on a edpuzle assignment. If you think this is an error please DM East_Arctica#9238 on discord!")
}

document.head.insertAdjacentHTML('beforeend', `<style type="text/css">
correct-answer-x3Ca8B {
  color: lime !important;
}
</style>`);

function Fix(s) {
	sEnd = s.lastIndexOf("&nbsp;")
	if (sEnd == s.length - 6) {
		s = s.substring(0, sEnd)
	}
	s = s.replace(/&nbsp;/g, " ")
	s = s.replace(/&#8203;/g, "‍")
	s = jQuery('<div>').html(String(s))[0].innerHTML
	s = s.replace(/\s+/g, ' ')
	return s
}

if (document.location.href.includes("edpuzzle.com/assignments/")) {
	let start = document.location.href.search("/assignments/") + 13
	let end = document.location.href.search("/watch")
	let QuizID = document.location.href.slice(start, end)
	let APIURL = "https://edpuzzle.com/api/v3/assignments/" + QuizID
/*
	This doesn't work for some reason...
	let xhttp = new XMLHttpRequest;
	xhttp.open("GET", APIURL, 0)
	xhttp.send()
	QuizData = JSON.parse(xhttp.responseText)

	This does though??????
	$.get(APIURL).success((response) => {
		console.log(response)
		QuizData = response
	})
	Haha so funny thing this doesn't work anymore. It's been one day.
*/
	let xhttp = new XMLHttpRequest;
	xhttp.open("GET", APIURL, 0)
	xhttp.setRequestHeader("x-edpuzzle-web-version", __EDPUZZLE_DATA__.version)
	xhttp.setRequestHeader("x-edpuzzle-referrer", document.location.href)
	xhttp.send()
	QuizData = JSON.parse(xhttp.responseText)
} else {
	let start = document.location.href.search("/media/") + 7
	let end = document.location.href.length
	let QuizID = document.location.href.slice(start, end)
	let APIURL = "https://edpuzzle.com/api/v3/media/" + QuizID
/*
	This doesn't work for some reason...
	let xhttp = new XMLHttpRequest;
	xhttp.open("GET", APIURL, 0)
	xhttp.send()
	QuizData = JSON.parse(xhttp.responseText)

	This does though??????
	$.get(APIURL).success((response) => {
		console.log(response)
		QuizData = response
	})
	Haha so funny thing this doesn't work anymore. It's been one day.
*/
	let xhttp = new XMLHttpRequest;
	xhttp.open("GET", APIURL, 0)
	xhttp.setRequestHeader("x-edpuzzle-web-version", __EDPUZZLE_DATA__.version)
	xhttp.setRequestHeader("x-edpuzzle-referrer", document.location.href)
	xhttp.send()
	QuizData = JSON.parse(xhttp.responseText)
}
let LastQuestion

function Start() {
	setTimeout(function() {
		if (document.getElementsByClassName('_2ck9StMwG9')[0]) {
			// A question is visible
			let Question = Fix(document.getElementsByClassName('_9FPn8OzVbH _2yXznYfjSY _1ywxTGela8 _1FldHIpVii _2_UfyNB01a')[0].innerHTML)
			if (Question !== LastQuestion) {
				LastQuestion = Question
				if (QuizData.medias) {
					Questions = QuizData.medias[0].questions
				} else {
					Questions = QuizData.questions
				}
				for (let i = 0; i < Questions.length; i++) {
					let ToCheck = Fix(Questions[i].body[0].html)
					if (ToCheck == LastQuestion) {
						if (Questions[i].choices) {
							console.error(Questions[i])
							for (let x = 0; x < Questions[i].choices.length; x++) {
								if (Questions[i].choices[x].isCorrect) {
									let Answer = Fix(Questions[i].choices[x].body[0].html)
									let Choices = document.getElementsByClassName('_1y6SsObDml')[0].children
									for (let y = 0; y < Choices.length; y++) {
										if (Fix(Choices[y].children[1].children[0].children[0].innerHTML) == Answer) {
											Choices[y].children[1].children[0].children[0].innerHTML = "<correct-answer-x3Ca8B><u>" + Choices[y].children[1].children[0].children[0].innerHTML + "</u></correct-answer-x3Ca8B>"
										}
									}
								}
							}
						} else if (Questions[i].feedback[0]) {
							let span = document.createElement('span')
							span.innerHTML = "Feedback found: <correct-answer-x3Ca8B><u>" + Questions[i].feedback[0].html + "</u></correct-answer-x3Ca8B>"
							document.getElementsByClassName('_2200X8EbqK')[0].appendChild(span)
						}
					}
				}
			}
		} else if (document.getElementsByClassName('_1y6SsObDml')[0]) {
			// A question is visible
			let Question = Fix(document.getElementsByClassName('_1y6SsObDml')[0].children[0].innerHTML)
			console.log(Question)
			if (Question !== LastQuestion) {
				LastQuestion = Question
				let Questions = QuizData.medias[0].questions
				for (let i = 0; i < Questions.length; i++) {
					let ToCheck = Fix(Questions[i].body[0].text)
					if (ToCheck == LastQuestion) {
						if (Questions[i].choices) {
							for (let x = 0; x < Questions[i].choices.length; x++) {
								if (Questions[i].choices[x].isCorrect) {
									let Answer = Fix(Questions[i].choices[x].body[0].html)
									let Choices = document.getElementsByClassName('_1y6SsObDml')[0].children
									for (let y = 0; y < Choices.length; y++) {
										if (Fix(Choices[y].children[1].children[0].children[0].innerHTML) == Answer) {
											Choices[y].children[1].children[0].children[0].innerHTML = "<correct-answer-x3Ca8B><u>" + Choices[y].children[1].children[0].children[0].innerHTML + "</u></correct-answer-x3Ca8B>"
										}
									}
								}
							}
						}
					}
				}
			}
		}
		Start()
	}, 10)
}

Start()