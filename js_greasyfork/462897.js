// ==UserScript==
// @name        WaniKani Review Context Sentences
// @description Shows the context sentence in the question during vocab reviews.
// @include     /^https?://(www\.)?wanikani\.com/subjects/review/?$/
// @namespace   Orzelius
// @version     1.0.2
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/462897/WaniKani%20Review%20Context%20Sentences.user.js
// @updateURL https://update.greasyfork.org/scripts/462897/WaniKani%20Review%20Context%20Sentences.meta.js
// ==/UserScript==

const localSentenceStore = {}

const registerListeners = () => {
    window.addEventListener(`didAnswerQuestion`, e => {
        if (!e.detail.subjectWithStats?.subject) return
        const subject = e.detail.subjectWithStats.subject
        const wasPassed = e.detail.results.passed

        if (subject.type !== "Vocabulary") return

        // exists and passed means it's the second correct answer
        if (localSentenceStore[subject.id] && wasPassed) {
            showExample(subject)
            return
        }

        // fetch examples on first correct answer
        if (!localSentenceStore[subject.id] && wasPassed) {
            wkof.Apiv2.fetch_endpoint('subjects/' + subject.id, {})
                .then(res => {
                localSentenceStore[subject.id] = res.data.context_sentences
            });
        }
    });
}

const showExample = (subject) => {
    document.getElementsByClassName("quiz-input__question-type")[0].innerHTML = ""
    const questionTypeContainerEl = document.getElementsByClassName("quiz-input__question-category")[0]
    const sentences = localSentenceStore[subject.id]
    const randomContextSentence = sentences[Math.floor(Math.random() * sentences.length)]
    const setContent = (content, font) => questionTypeContainerEl.innerHTML =
          `<span ${font ? `class="fancy-font quiz-input__question-category}"` : ""}>` + content + "</span>"
    const setOnClick = (func) => questionTypeContainerEl.onclick = func
    const setJaOnly = () => {
        setContent(randomContextSentence.ja, true)
        setOnClick(setJaAndEn)
    }
    const setJaAndEn = () => {
        setContent(randomContextSentence.ja + "<br>" + randomContextSentence.en, false)
        setOnClick(setJaOnly)
    }

    // First show only in japanese, if clicked also show english
    setJaOnly()
}

wkof.include('Apiv2');
wkof.ready('Apiv2').then(registerListeners);
