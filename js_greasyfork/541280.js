// ==UserScript==
// @name         pr*ca
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatycznie cenzuruje słowa wrażliwe dla bezrobotnych.
// @author       ndzk
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541280/pr%2Aca.user.js
// @updateURL https://update.greasyfork.org/scripts/541280/pr%2Aca.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const censoredWords = [

       		//PL
					"praca", "pracy", "pracę", "pracą", "praco", "prace", "pracach", "pracami", "pracowałem", "pracowałam", "pracowaliśmy", "pracowałyśmy", "pracujesz", "pracuje", 
      		"pracujecie", "pracują", "pracował", "pracowała", "pracowali", "pracowały", "pracować", "pracujący", "pracująca", "pracujące", "pracownik", "pracownika", "pracownikiem", 
      		"pracownicy", "pracownikom", "pracownikami", "pracowniczy", "pracownicza", "pracownicze", "pracowniczo", "pracownic", "pracowniczka", "pracowniczki", "pracus", "pracusie", 
      		"pracoholik", "pracoholiczka", "pracoholicy", "pracoholizm", "pracować na czarno", "zatrudnienie", "zatrudniony", "zatrudniona", "zatrudnione", "zatrudnieni", "zatrudnić", 
      		"zatrudnię", "zatrudnisz", "zatrudni", "zatrudnimy", "zatrudnicie", "zatrudniają", "zatrudniali", "zatrudniać", "zatrudniający", "zatrudniająca", "zatrudniające", "zatrudniająco", 
      		"zatrudniającemu", "etat", "etatowy", "etatowa", "etatowe", "etacik", "etacisko", "etatowiec", "etatowcy", "firma", "firmy", "firmie", "firmę", "firmą", "firmach", "firmami", "firmowy", "firmowa", "firmowe", "firmowo", "firmować", "zawód", "zawodu", "zawodem", "zawody", "zawodom", "zawodami", "zawodowy", 
      		"zawodowa", "zawodowe", "zawodowo", "kariera", "kariery", "karierę", "karierą", "karierach", "karierami", "karierowicz", "karierowiczka", "karierowicze", "karierowiczki", "robić karierę", "rekrutacja", 
      		"rekrutacji", "rekrutację", "rekrutacją", "rekrutacjach", "rekrutacjami", "rekrutacyjny", "rekrutacyjna", "rekrutacyjne", "rekrutować", "rekrutuję", "rekrutujesz", "rekrutuje", "rekrutujemy", "rekrutujecie", 
      		"rekrutują", "wykonasz", "wykona", "wykonamy", "wykonacie", "wykonają", "staż", "stażu", "stażem", "staże", "stażom", "stażami", "stażysta", "stażystka", "stażyści", "stażystki", "kontrakt", "kontraktu", "kontraktem", "kontrakty", 
      		"kontraktom", "kontraktami", "kontraktowy", "kontraktowa", "kontraktowe", "świadczenie", "świadczenia", "świadczeń", "świadczeniem", "świadczeniami", "biuro", "biura", "biurze", "biurem", "biur", "biurach", "biurami", 
      		"biurowy", "biurowa", "biurowe", "biurowiec", "kadry", "kadrach", "kadrami", "HR", "hrka", "HR-owiec", "cv", "CV", "cvee", "życiorys", "życiorysu", "życiorysem", "życiorysy", "życiorysom", "życiorysami", 
      
          //ENG
      		"work", "works", 	"worked", "working", "worker", "workers", "workaholic", "workaholics", "workplace", "job", "jobs", "jobless", "jobseeker", "jobseekers", "occupation", "occupations", "career", "careers", 
      		"employ", "employs", "employed", "employing", "employee", "employees", "employer", "employers", "unemployed", "unemployment", "full-time", "part-time", "internship", "internships", "intern", "interns", "recruitment", 	
      		"recruit", "recruits", "recruited", "recruiting", "hiring", "hire", "hires", "hired", "office", "offices", "resume", "resumes", "CV", "cover letter", "cover letters", "layoff", "layoffs", "quit", "quits", "quitting", 
      	  "quitters", "fired", "fire", "fires", "firing", "boss", "bosses", "manager", "managers", "colleague", "colleagues", "deadline", "deadlines", "💼", "📄", "📁", "👔", "🏢", "#work", "#working", "#job", "#jobs", "#career", 
      	  "#hiring", "#recruitment", "#internship", "#employee", "#boss", "#manager", "bosa", "bos", "managa", "maneger", "menegr", "emploee", "emplyee", "emploies", "resumé", "résumé", "curriculum vitae", 
      	  "lay off", "laid off", "fire me", "fired me", "quit job", "quit my job", "give notice", "two weeks notice", "burnout", "burned out", "burnt out", "corporate", "corporate slave", "corporate slaves", "corporation", "corporations", 
      	  "headhunter", "headhunting", "headhunted", "gig", "gigs", "gig work", "freelance", "freelancer", "freelancers", "freelancing", "contractor", "contractors", "temp", "temps", "temporary", "permanent", "promotion", "promotions", 
      	  "demotion", "demotions", "salary", "salaries", "wage", "wages", "paycheck", "paychecks", "overtime", "holiday", "holidays", "vacation", "vacations", "paid leave", "unpaid leave", "colab", 
      	  "office politics", "micromanager", "micromanagers", "micromanagement", "appraisal", "appraisals", "reference", "references", "recommendation", "recommendations", "training", 
      	  "trainings", "orientation", "onboarding", "probation", "probation period", "mentorship", "mentor", "mentors", "mentee", "mentees", "job hunt", "job hunting", "job searching", "job search", "headhunt", "headhunted", "headhunter", 
      	  "headhunting", "talent acquisition", "talent scout", "headhunter", "staffing", "staff", "staffer", "staffers"


    ];

    const censoredRegex = new RegExp(`\\b(${censoredWords.map(escapeRegExp).join('|')})\\b`, 'gi');

    function censorText(text) {
        return text.replace(censoredRegex, match => {
            if (match.length <= 2) return '*'.repeat(match.length);
            const first = match[0];
            const last = match[match.length - 1];
            return first + '*'.repeat(match.length - 2) + last;
        });
    }

    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = censorText(node.nodeValue);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || node.isContentEditable) return;
            for (let child of node.childNodes) {
                processNode(child);
            }
        }
    }

    const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                processNode(node);
            }
        }
    });


    processNode(document.body);

    observer.observe(document.body, { childList: true, subtree: true });

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

})();
