// ==UserScript==
// @name           Coincidence Detector
// @description    Replaces text on websites. Now supports wildcards in search queries. Won't replace text in certain tags like links and code blocks
// @include        http://*
// @include        https://*
// @include        file://*
// @exclude        http://userscripts.org/*
// @exclude        https://greasyfork.org/*
// @copyright      AtThyRightHand.
// @version        1.0.0.0003
// @license        http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @namespace https://greasyfork.org/users/234813
// @downloadURL https://update.greasyfork.org/scripts/375915/Coincidence%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/375915/Coincidence%20Detector.meta.js
// ==/UserScript==
(function () {
    'use strict';


    /*
        NOTE:
            You can use \\* to match actual asterisks instead of using it as a wildcard!
    */

    var words = {
    ///////////////////////////////////////////////////////


        // Syntax: 'Search word' : 'Replace word',
        'George Soros' : 'George Soros',
        'Schwartz György' : 'Schwartz György',
        'Schwartz Pál' : 'Schwartz Pál',
        'Jonathan Tivadar Soros' : 'Jonathan Tivadar Soros',
        'Paul Soros' : 'Paul Soros',
        'Alexander Soros' : 'Alexander Soros',
        'Jonathan Soros' : 'Jonathan Soros',
        'Alexander G. Soros' : 'Alexander G. Soros',
        'Bernie Sanders' : 'Bernie Sanders',
        'Mark Zuckerberg':'Mark Zuckerberg',
        'Michael Bloomberg' : 'Michael Bloomberg',
        'Jill Abramson' : 'Jill Abramson',
        'Martin Agronsky' : 'Martin Agronsky',
        'Kate Bolduan' : 'Kate Bolduan',
        'Bonnie Bernstein' : 'Bonnie Bernstein',
        'Carl Bernstein' : 'Carl Bernstein',
        'Wolf Blitzer' : 'Wolf Blitzer',
        'David Brooks' : 'David Brooks',
        'Benyamin Cohen' : 'Benyamin Cohen',
        'Katie Couric' : 'Katie Couric',
        'Benjamin De Casseres' : 'Benjamin De Casseres',
        'Morton Dean' : 'Morton Dean',
        'Matt Drudge' : 'Matt Drudge',
        'Giselle Fernández' : 'Giselle Fernández',
        'Thomas Friedman' : 'Thomas Friedman',
        'Bob Garfield' : 'Bob Garfield',
        'Brooke Gladstone' : 'Brooke Gladstone',
        'Hadas Gold' : 'Hadas Gold',
        'Bernard Goldberg' : 'Bernard Goldberg',
        'Jeffrey Goldberg' : 'Jeffrey Goldberg',
        'Jonah Goldberg' : 'Jonah Goldberg',
        'Linda Greenhouse' : 'Linda Greenhouse',
        'Roy Gutman' : 'Roy Gutman',
        'David Halberstam' : 'David Halberstam',
        'Seymour Hersh' : 'Seymour Hersh',
        'Christopher Hitchens' : 'Christopher Hitchens',
        'Eliana Johnson' : 'Eliana Johnson',
        'John King' : 'John King',
        'Larry King' : 'Larry King',
        'Ted Koppel' : 'Ted Koppel',
        'Charles Krauthammer' : 'Charles Krauthammer',
        'Paul Krugman' : 'Paul Krugman',
        'Franz Lidz' : 'Franz Lidz',
        'Dave Marash' : 'Dave Marash',
        'Suzy Menkes' : 'Suzy Menkes',
        'Edwin Newman' : 'Edwin Newman',
        'Daniel Pearl' : 'Daniel Pearl',
        'Nathan Rabin' : 'Nathan Rabin',
        'Frank Rich' : 'Frank Rich',
        'Geraldo Rivera' : 'Geraldo Rivera',
        'Steven V. Roberts' : 'Steven V. Roberts',
        'Lester Rodney' : 'Lester Rodney',
        'William Safire' : 'William Safire',
        'Daniel Schorr' : 'Daniel Schorr',
        'George Seldes' : 'George Seldes',
        'Gene Shalit' : 'Gene Shalit',
        'David Shuster' : 'David Shuster',
        'Joel Siegel' : 'Joel Siegel',
        'Ron Suskind' : 'Ron Suskind',
        'Joel Stein' : 'Joel Stein',
        'Gloria Steinem' : 'Gloria Steinem',
        'I. F. Stone' : 'I. F. Stone',
        'Jake Tapper' : 'Jake Tapper',
        'Mike Wallace' : 'Mike Wallace',
        'Barbara Walters' : 'Barbara Walters',
        'Miriam Weiner' : 'Miriam Weiner',
        'Marco Werman' : 'Marco Werman',
        'Walter Winchell' : 'Walter Winchell',
        'Michael Wolff' : 'Michael Wolff',
        'Gideon Yago' : 'Gideon Yago',
        'Richard Blumenthal' : 'Richard Blumenthal',
        'Brian Schatz' : 'Brian Schatz',
        'Ben Cardin' : 'Ben Cardin',
        'Chuck Schumer' : 'Chuck Schumer',
        'Ron Wyden' : 'Ron Wyden',
        'Bernie Sanders' : 'Bernie Sanders',
        'Judah P. Benjamin' : 'Judah P. Benjamin',
        'Rudy Boschwitz' : 'Rudy Boschwitz',
        'Barbara Boxer' : 'Barbara Boxer',
        'William Cohen' : 'William Cohen',
        'Norm Coleman' : 'Norm Coleman',
        'Russell Feingold' : 'Russell Feingold',
        'Al Franken' : 'Al Franken',
        'Ernest Gruening' : 'Ernest Gruening',
        'Simon Guggenheim' : 'Simon Guggenheim',
        'Chic Hecht' : 'Chic Hecht',
        'Jacob K. Javits' : 'Jacob K. Javits',
        'Benjamin F. Jonas' : 'Benjamin F. Jonas',
        'Herbert Kohl' : 'Herbert Kohl',
        'Frank Lautenberg' : 'Frank Lautenberg',
        'Herbert Lehman' : 'Herbert Lehman',
        'Carl Levin' : 'Carl Levin',
        'Joe Lieberman' : 'Joe Lieberman',
        'Howard Metzenbaum' : 'Howard Metzenbaum',
        'Richard Neuberger' : 'Richard Neuberger',
        'Isidor Rayner' : 'Isidor Rayner',
        'Abraham A. Ribicoff' : 'Abraham A. Ribicoff',
        'Warren Rudman' : 'Warren Rudman',
        'Pierre Salinger' : 'Pierre Salinger',
        'Joseph Simon' : 'Joseph Simon',
        'Arlen Specter' : 'Arlen Specter',
        'Richard Stone' : 'Richard Stone',
        'Paul Wellstone' : 'Paul Wellstone',
        'David Levy Yulee' : 'David Levy Yulee',
        'Edward Zorinsky' : 'Edward Zorinsky',
        'Adam Schiff' : 'Adam Schiff',
        'Brad Sherman' : 'Brad Sherman',
        'Alan Lowenthal' : 'Alan Lowenthal',
        'Susan Davis' : 'Susan Davis',
        'Jared Polis' : 'Jared Polis',
        'Lois Frankel' : 'Lois Frankel',
        'Ted Deutch' : 'Ted Deutch',
        'Debbie Wasserman Schultz' : 'Debbie Wasserman Schultz',
        'Jan Schakowsky' : 'Jan Schakowsky',
        'Brad Schneider' : 'Brad Schneider',
        'John Yarmuth' : 'John Yarmuth',
        'Jamie Raskin' : 'Jamie Raskin',
        'Sander Levin' : 'Sander Levin',
        'Jacky Rosen' : 'Jacky Rosen',
        'Josh Gottheimer' : 'Josh Gottheimer',
        'Lee Zeldin' : 'Lee Zeldin',
        'Jerrold Nadler' : 'Jerrold Nadler',
        'Eliot Engel' : 'Eliot Engel',
        'Nita Lowey' : 'Nita Lowey',
        'David Cicilline' : 'David Cicilline',
        'David Kustoff' : 'David Kustoff',
        'Steve Cohen' : 'Steve Cohen',
        'Ruth Bader Ginsburg' : 'Ruth Bader Ginsburg',
        'Stephen Breyer' : 'Stephen Breyer',
        'Elena Kagan' : 'Elena Kagan',
        'Louis Brandeis' : 'Louis Brandeis',
        'Benjamin Cardozo' : 'Benjamin Cardozo',
        'Felix Frankfurter' : 'Felix Frankfurter',
        'Nancy Wyman' : 'Nancy Wyman',
        'David Zuckerman' : 'David Zuckerman',
        'Joe Straus' : 'Joe Straus',
        'Kel Seliger' : 'Kel Seliger',
        'Scott Wiener' : 'Scott Wiener',
        'Anthony Wiener' : 'Anthony Wiener',
        'Moses Alexander' : 'Moses Alexander',
        'Simon Bamberger' : 'Simon Bamberger',
        'Washington Bartlett' : 'Washington Bartlett',
        'David Emanuel' : 'David Emanuel',
        'Neil Goldschmidt' : 'Neil Goldschmidt',
        'Ernest Gruening' : 'Ernest Gruening',
        'Henry Horner' : 'Henry Horner',
        'Madeleine Kunin' : 'Madeleine Kunin',
        'Herbert H. Lehman' : 'Herbert H. Lehman',
        'Frank Licht' : 'Frank Licht',
        'Linda Lingle' : 'Linda Lingle',
        'Marvin Mandel' : 'Marvin Mandel',
        'Jack Markell' : 'Jack Markell',
        'Julius Meier' : 'Julius Meier',
        'Ed Rendell' : 'Ed Rendell',
        'Abraham Ribicoff' : 'Abraham Ribicoff',
        'Edward S. Salomon' : 'Edward S. Salomon',
        'Arthur Seligman' : 'Arthur Seligman',
        'Samuel H. Shapiro' : 'Samuel H. Shapiro',
        'Ben Shapiro' : 'Ben Shapiro',
        'Milton Shapp' : 'Milton Shapp',
        'Peter Shumlin' : 'Peter Shumlin',
        'Eliot Spitzer' : 'Eliot Spitzer',
        'Bruce Sundlun' : 'Bruce Sundlun',
        'Ethan Berkowitz' : 'Ethan Berkowitz',
        'Steve Adler' : 'Steve Adler',
        'Miro Weinberger' : 'Miro Weinberger',
        'Andy Berke' : 'Andy Berke',
        'Rahm Emanuel' : 'Rahm Emanuel',
        'Steven Fulop' : 'Steven Fulop',
        'Carolyn Goodman' : 'Carolyn Goodman',
        'Eric Garcetti' : 'Eric Garcetti',
        'Paul Soglin' : 'Paul Soglin',
        'Libby Schaaf' : 'Libby Schaaf',
        'Ron Nirenberg' : 'Ron Nirenberg',
        'Rick Kriseman' : 'Rick Kriseman',
        'Jonathan Rothschild' : 'Jonathan Rothschild',
        'Jerry Abramson' : 'Jerry Abramson',
        'Jay Dardenne' : 'Jay Dardenne',
        'Matthew Denn' : 'Matthew Denn',
        'Lee Fisher' : 'Lee Fisher',
        'Ken Rothman' : 'Ken Rothman',
        'Harriett Woods' : 'Harriett Woods',
        'Eric Greitens' : 'Eric Greitens',
        'Arthur Goldberg' : 'Arthur Goldberg',
        'Steve Mnuchin' : 'Steve Mnuchin',
        'Jack Lew' : 'Jack Lew',
        'Penny Pritzker' : 'Penny Pritzker',
        'Abe Fortas' : 'Abe Fortas',
        'Jill Stein' : 'Jill Stein',
        'Barry Goldwater' : 'Barry Goldwater',
        'Milton Shapp' : 'Milton Shapp',
        'Jane Harman' : 'Jane Harman',
        'Julius Houseman' : 'Julius Houseman',
        'Steve Israel' : 'Steve Israel',
        'Julius Kahn' : 'Julius Kahn',
        'Florence Prag Kahn' : 'Florence Prag Kahn',
        'Ed Koch' : 'Ed Koch',
        'Tom Lantos' : 'Tom Lantos',
        'William Lehman' : 'William Lehman',
        'Mel Levine' : 'Mel Levine',
        'Marjorie Margolies-Mezvinsky' : 'Marjorie Margolies-Mezvinsky',
        'Edward Mezvinsky' : 'Edward Mezvinsky',
        'Philip Phillips' : 'Philip Phillips',
        'Allyson Schwartz' : 'Allyson Schwartz',
        'Norman Sisisky' : 'Norman Sisisky',
        'Gladys Spellman' : 'Gladys Spellman',
        'Sam Steiger' : 'Sam Steiger',
        'Henry Waxman' : 'Henry Waxman',
        'Robert Wexler' : 'Robert Wexler',
        'Ted Weiss' : 'Ted Weiss',
        'Sidney R. Yates' : 'Sidney R. Yates',
        'Dick Zimmer' : 'Dick Zimmer',
        'Jerry Abramson' : 'Jerry Abramson',
        'Moses Alexander' : 'Moses Alexander',
        'Abe Aronovitz' : 'Abe Aronovitz',
        'Harry Bacharach' : 'Harry Bacharach',
        'Walt Bachrach' : 'Walt Bachrach',
        'Abraham Beame' : 'Abraham Beame',
        'Martin Behrman' : 'Martin Behrman',
        'Bruce Blakeman' : 'Bruce Blakeman',
        'Michael Bloomberg' : 'Michael Bloomberg',
        'Richard Berkley' : 'Richard Berkley',
        'David Cicilline' : 'David Cicilline',
        'Larry Cohen' : 'Larry Cohen',
        'Josh Cohen' : 'Josh Cohen',
        'Norm Coleman' : 'Norm Coleman',
        'Leopold David' : 'Leopold David',
        'Mutt Evans' : 'Mutt Evans',
        'Dianne Feinstein' : 'Dianne Feinstein',
        'Bob Filner' : 'Bob Filner',
        'Samuel Folz' : 'Samuel Folz',
        'Lois Frankel' : 'Lois Frankel',
        'Sandra Freedman' : 'Sandra Freedman',
        'Jeffrey Friedman' : 'Jeffrey Friedman',
        'Eva Galambos' : 'Eva Galambos',
        'Bailey Gatzert' : 'Bailey Gatzert',
        'Susan Golding' : 'Susan Golding',
        'Neil Goldschmidt' : 'Neil Goldschmidt',
        'Stephen Goldsmith' : 'Stephen Goldsmith',
        'Oscar Goodman' : 'Oscar Goodman',
        'Phil Gordon' : 'Phil Gordon',
        'Bill Graidson' : 'Bill Graidson',
        'Robert Harris' : 'Robert Harris',
        'Adlene Harrison' : 'Adlene Harrison',
        'Julius Houseman' : 'Julius Houseman',
        'Vera Katz' : 'Vera Katz',
        'Ed Koch' : 'Ed Koch',
        'Joseph Lazarow' : 'Joseph Lazarow',
        'Henry Loeb' : 'Henry Loeb',
        'Zachariah J. Loussac' : 'Zachariah J. Loussac',
        'Sophie Masloff' : 'Sophie Masloff',
        'Sam Massell' : 'Sam Massell',
        'Laura Miller' : 'Laura Miller',
        'Arthur Naftalin' : 'Arthur Naftalin',
        'Meyera Oberndorf' : 'Meyera Oberndorf',
        'Murray Seasongood' : 'Murray Seasongood',
        'Kel Seliger' : 'Kel Seliger',
        'Florence Shapiro' : 'Florence Shapiro',
        'Joseph Simon' : 'Joseph Simon',
        'Jerry Springer' : 'Jerry Springer',
        'Sam Steiger' : 'Sam Steiger',
        'Annette Strauss' : 'Annette Strauss',
        'Adolph Sutro' : 'Adolph Sutro',
        'Susan Weiner' : 'Susan Weiner',
        'Edward Zorinsky' : 'Edward Zorinsky',
        'Bella Abzug' : 'Bella Abzug',
        'Gary Ackerman' : 'Gary Ackerman',
        'John Adler' : 'John Adler',
        'Martin C. Ansorge' : 'Martin C. Ansorge',
        'Isaac Bacharach' : 'Isaac Bacharach',
        'Anthony C. Beilenson' : 'Anthony C. Beilenson',
        'Victor L. Berger' : 'Victor L. Berger',
        'Shelley Berkley' : 'Shelley Berkley',
        'Howard Berman' : 'Howard Berman',
        'Sol Bloom' : 'Sol Bloom',
        'Barbara Boxer' : 'Barbara Boxer',
        'Sala Burton' : 'Sala Burton',
        'Eric Cantor' : 'Eric Cantor',
        'Sam Coppersmith' : 'Sam Coppersmith',
        'Jacob A. Cantor' : 'Jacob A. Cantor',
        'Ben Cardin' : 'Ben Cardin',
        'William M. Citron' : 'William M. Citron',
        'William Cohen' : 'William Cohen',
        'William W. Cohen' : 'William W. Cohen',
        'Peter Deutsch' : 'Peter Deutsch',
        'Samuel Dickstein' : 'Samuel Dickstein',
        'Mickey Edwards' : 'Mickey Edwards',
        'Rahm Emanuel' : 'Rahm Emanuel',
        'Eric Fingerhut' : 'Eric Fingerhut',
        'Bob Filner' : 'Bob Filner',
        'Jon D. Fox' : 'Jon D. Fox',
        'Barney Frank' : 'Barney Frank',
        'Martin Frost' : 'Martin Frost',
        'Sam Gejdenson' : 'Sam Gejdenson',
        'Gabrielle Giffords' : 'Gabrielle Giffords',
        'Bill Graidson' : 'Bill Graidson',
        'Alan Grayson' : 'Alan Grayson',

    ///////////////////////////////////////////////////////
    '':''};











    //////////////////////////////////////////////////////////////////////////////
    // This is where the real code is
    // Don't edit below this
    //////////////////////////////////////////////////////////////////////////////

    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;

    // used to take a string and ready it for use in new RegExp()
    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
    }

    // function to decide whether a parent tag will have its text replaced or not
    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }

    delete words[''];

    // convert the 'words' JSON object to an Array
    for (word in words) {
        if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);

            // add the search/needle/query
            if (userRegexp) {
                regexs.push(
                    new RegExp(userRegexp[1], 'g')
                );
            } else {
                regexs.push(
                    new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
                        return fullMatch === '\\*' ? '*' : '[^ ]*';
                    }), 'g')
                );
            }

            // add the replacement
            replacements.push( words[word] );
        }
    }

    // do the replacement
    texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
    for (i = 0; text = texts.snapshotItem(i); i += 1) {
        if ( isTagOk(text.parentNode.tagName) ) {
            regexs.forEach(function (value, index) {
                text.data = text.data.replace( value, "(((" + replacements[index] + ")))");
            });
        }
    }

}());