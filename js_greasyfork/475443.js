// ==UserScript==
// @name         Highlight Keywords
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Highlight related keywords on web pages
// @author       Edward_Lai
// @match        https://www.proquest.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475443/Highlight%20Keywords.user.js
// @updateURL https://update.greasyfork.org/scripts/475443/Highlight%20Keywords.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Script started');

    const race_keywords = [
            'African','African-American','African American', 'Asian', 'Asian American', 'Caucasian', 'White', 'Black',
            'Hispanic', 'Latino', 'Latina', 'Latinx', 'Native American', 'Native',
            'Indigenous', 'Multiracial', 'Biracial', 'Mixed race'
        ].sort((a, b) => b.length - a.length);

    const Names = [
        'Josef Neumann', 'Ahmaud Arbery','Grafton E. Thomas', 'Jennifer Chioma Ebichi', 'Michael Egwuagu',
        'Tessa Majors', 'Jennifer Dulos', 'Fotis Dulos', 'Michelle C. Troconis', 'Maria Fuertes',
        'Reeaz Khan', 'David N. Anderson', 'Francine Graham', 'Patrick Wood Crusius',
        'William H. Green', 'Michael Owen', 'Tatiana Walton', 'Kelvin Philp', 'Tommy Valva',
        'Michael Valva', 'Angela Pollina', 'Kenneth Savinski', 'Alex Ray Scott', 'Kaseem Watkins.',
        'Teshawn Watkins', 'Kendrick Castillo', 'Alec McKinney', 'Devon Erickson', 'L. Antonio Litman',
        'Dondre Richardson', 'Inell Jones', 'Malika Jones', 'James Connor', 'Hassan Elliott',
        'Troy D. Rapp', 'Joaquin Roman', 'Matthew Morris', 'Shannon Perkins', 'Christopher Walsh',
        'Garrett Goble', 'Guillermo Garcia', 'Ahmaud Arbrey', 'Gregory McMichael', 'Travis McMichael',
        'Layla Peláez', 'Juan Carlos Pagán Bonilla', 'Serena Angelique Velázquez', 'Sean Díaz de León',
        'Calvin Munerlyn', 'Ramonyea T. Bishop', 'Larry E. Teague', 'Ana Desousa', 'Alafia Rodriguez',
        'Phillip Moreno', 'Breonna Taylor', 'Dwight Powers', 'Thomas Scully-Powers', 'Ted DeMers',
        'Peter Manfredonia', 'George Floyd', 'Derek Chauvin', 'David Mcatee', 'Manuel Ellis', 'Dave Patrick Underwood',
        'Steve Carillo', 'Elijah Mcclain', 'Modesto Reyes', 'Nicolas Chavez', 'John Legg', 'Frederic Rogers', 'Rayshard Brooks',
        'Tyler Gerth', 'Steven Lopez', 'John Neville', 'Bashar Jackson', 'Corey Walker', 'Keandre D. Rodgers', 'Jaquan Murphy',
        'Fahim Saleh', 'Esther Salas', 'Daniel Anderl', 'Garrett Foster', 'Daniel Perry', 'William Durham', 'Zachary Latham',
        'Joseph Rosenbaum', 'Anthony Huber', 'Kyle Rittenhouse', 'Rusten Sheskey', 'Daniel Prude', 'Michael Forest Reinoehl',
        'Aaron J. Danielson', 'Kaitlyn Yozviak', 'John Joseph Yozviak', 'Mary Katherine Horton', 'Jonathan Price', 'Shaun Lucas',
        'Harold Preston', 'Elmer Manzano', 'Walter Wallace Jr.', 'Dayvon Bennett', 'Timothy Leeks', 'Nyla Bond', 'Anmerie Morales',
        'Angelo Crooms', 'Sincere Pierce', 'Jafet Santiago-Miranda', 'Aiden Ellison', 'Robert Paul Keegan', 'Casey Christopher Goodson Jr.',
        'Jason Meade', 'Pamela Abercrombie', 'Perez D. Reed', 'Caelen Bosisto', 'Andrew Geronimi', 'Jackson Sparks', 'Virginia Sorenson',
        'Leanna Owen', 'Tamara Durand', 'Wilhelm Hospel', 'Jane Kulich', 'Darrell E. Brooks', 'Damian Z. Dymka', 'Louis Santiago', 'Alejandra Jacobs',
        'Robert Holmes', 'Charlie Vasquez', 'Adam Gaubert', 'Pamela Adair', 'Matthew Reese Mire', 'Maria Ambrocio', 'Jermaine Foster', 'Jamie Liang',
        'Yvonne Wu', 'Robert Aaron Long', 'Jayce Eubanks', 'Jerimiah Johnson', 'Legacy Beauford', 'Keishawn Gordon', 'Adil Dghoughi', 'Terry Turner',
        'Manuela Rodriguez', 'Eddie F. Gonzalez', 'Monica Goods', 'Christopher Baldner', 'Than Than Htwe', 'David Robinson', 'George Gonzalez',
        'Austin Williams Lanz', 'Miguel Solorzano', 'Aaron Garcia', 'Gulia Dale', 'Garrett Armstrong', 'Steven Kneidl', 'Keyon Harrold Jr.', 'Miya Ponsetto',
        'Fred Garcia', 'Emmanuel Duron', 'Kyle Vinson', 'John Haubert', 'Samuel James Cassidy', 'Justin Wallace', 'Jovan Young', 'Moussa Fofana', 'Yohan Hernandez',
        'Xiao Zhen Xie', 'Steven Jenkins', 'Timothy J Wall', 'Shane Wayne Michael', 'Mark Dinning', 'Iremamber Sykap', 'Geoffrey H.L. Thom', 'Zackary K. Ah Nee', 'Christopher J. Fredeluces',
        'Juanisha Brooks', 'Robert G. Hindenlang', 'Andrew Brown Jr.', 'Daniel Meads', 'Robert Morgan', 'Aaron Lewellyn', 'Teodoro Macias', 'Michelle Ligon', 'George Ligon', 'Chris Ward',
        'Logan Fox', 'Alicia Cardenas', 'Danny Schofield', 'Lyndon James Mcleod', 'William Jones Jr.', 'Daniel Elena Lopez', 'Valentina Orellana-Peralta'
    ];

    const commonFirstNames = [
        'James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Joseph',
        'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark',
        'Donald', 'Steven', 'Andrew', 'Paul', 'Joshua', 'Kenneth', 'Kevin', 'Brian',
        'George', 'Timothy', 'Ronald', 'Jason', 'Edward', 'Jeffrey', 'Ryan', 'Jacob',
        'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott',
        'Brandon', 'Benjamin', 'Samuel', 'Gregory', 'Alexander', 'Patrick', 'Frank',
        'Raymond', 'Jack', 'Dennis', 'Jerry', 'Tyler', 'Aaron', 'Jose', 'Adam', 'Nathan',
        'Henry', 'Zachary', 'Douglas', 'Peter', 'Kyle', 'Noah', 'Ethan', 'Jeremy', 'Walter',
        'Christian', 'Keith', 'Roger', 'Terry', 'Austin', 'Sean', 'Gerald', 'Carl', 'Harold',
        'Dylan', 'Arthur', 'Lawrence', 'Jordan', 'Jesse', 'Bryan', 'Billy', 'Bruce', 'Gabriel',
        'Joe', 'Logan', 'Alan', 'Juan', 'Albert', 'Willie', 'Elijah', 'Wayne', 'Randy', 'Vincent',
        'Mason', 'Roy', 'Ralph', 'Russell', 'Bradley', 'Philip', 'Eugene'
    ];



    const commonTitles = ['Dr', 'Mr', 'Mrs', 'Ms', 'Prof', 'Rev'];
    // Keywords to be disregarded in name sequences
    const disregardedKeywords = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
        'Department','court', 'The', 'State','Service','City','District', 'Will','Jury','Rev','Dr',
        'Mr','Mrs','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',
        'Mon','Tue','Wed','Thu','Fri','Sat','Sun','county','Judicial'
    ];

    // Function to create a highlighted text span
    function createHighlightSpan(text, color) {
        const highlight = document.createElement('span');
        highlight.style.backgroundColor = color;
        highlight.appendChild(document.createTextNode(text));
        return highlight;
    }

    // Function to check if a name sequence is valid
    function isValidNameSequence(name) {
        return !disregardedKeywords.some(keyword => name.includes(keyword));
    }

     function hasAtLeastTwoCapitalizedWords(name) {
        return (name.match(/[A-Z][a-z]+/g) || []).length >= 2;
    }

    // Function to highlight text in a text node
function highlightText(textNode) {
    console.log('Processing text node:', textNode.nodeValue);
    try {
        const text = textNode.nodeValue;
        let lastIndex = 0;
        const fragment = document.createDocumentFragment();

        // Regular expression for name sequences and keywords
        const nameSequenceRegex = /(\.|"|\s|^)\s*([A-Z][a-z]+(?:\s[A-Z]\.)?(?:\s[A-Z][a-z]+)*)\b/g;
        const keywordRegex = new RegExp(`\\b(${race_keywords.join('|')})\\b`, 'ig');

        // Highlight names
        let match;
        while ((match = nameSequenceRegex.exec(text)) !== null) {
            const prefix = match[1];
            const name = match[2];

            const isStartOfSentence = match.index === 0 || prefix === '.';
            const followsQuote = prefix === '"';
            const containsDisregardedWords = disregardedKeywords.some(keyword => name.includes(keyword));

             if (!isStartOfSentence && !followsQuote && !containsDisregardedWords && hasAtLeastTwoCapitalizedWords(name)) {
                if (Names.includes(name)) {
                    fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index + prefix.length)));
                    fragment.appendChild(createHighlightSpan(name, '#F08080'));
                } else {
                    fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index + prefix.length)));
                    fragment.appendChild(createHighlightSpan(name, '#FFCCCB'));
                }
                lastIndex = nameSequenceRegex.lastIndex;
            }
        }

        // Highlight keywords
        while ((match = keywordRegex.exec(text)) !== null) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
            fragment.appendChild(createHighlightSpan(match[0], 'yellow'));
            lastIndex = keywordRegex.lastIndex;
        }

        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
        textNode.parentNode.replaceChild(fragment, textNode);

    } catch (error) {
        console.error('Error in highlightText:', error);
    }
}


    // Function to walk the DOM and apply a function to each node
    function walkDOM(node, func) {
        func(node);
        node = node.firstChild;
        while (node) {
            walkDOM(node, func);
            node = node.nextSibling;
        }
    }

    // Delay to allow page content to load
    setTimeout(function() {
        console.log('Starting DOM walk...');

        // Walk the DOM to highlight text
        const containerElements = document.querySelectorAll('.display_record_text_copy p');
        Array.from(containerElements).forEach(element => {
            if (!element.hasAttribute('data-processed')) {
                walkDOM(element, function(node) {
                    if (node.nodeType === 3) {
                        highlightText(node);
                    }
                });
                element.setAttribute('data-processed', true);
            }
        });

        // Highlight the document title
        const titleElement = document.getElementById('documentTitle');
        if (titleElement && !titleElement.hasAttribute('data-processed')) {
            walkDOM(titleElement, function(node) {
                if (node.nodeType === 3) {
                    highlightText(node);
                }
            });
            titleElement.setAttribute('data-processed', true);
        }

    }, 2000);
})();
