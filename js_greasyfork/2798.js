/*  IMDBAge v2.14 - Greasemonkey script to add actors ages to IMDB pages
    Copyright (C) 2005-2020 Thomas Stewart <thomas@stewarts.org.uk>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

    Inspired in 2001, Created on 24/03/2005, Last Changed 28/12/2020
    Major bug fixes and improvements by Christopher J. Madsen

    This is a Greasemonkey user script, see http://www.greasespot.net/ and
    https://addons.mozilla.org/firefox/addon/748

    New versions can be found on the following sites:
    https://stewarts.org.uk/project/imdbage/
    http://userscripts.org/scripts/show/1060 (dead)
    https://greasyfork.org/scripts/2798-imdbage
    https://monkeyguts.com/code.php?id=268 (dead)
    https://openuserjs.org/scripts/thomas_d_stewart/IMDBAge
    https://github.com/thomasdstewart/IMDBAge

    This script adds the age and other various info onto IMDB pages.
    Specifically it adds some details to actor or actresses pages. It adds
    their age, their Tropical Zodiac Sign and their Chinese Zodiac Sign. As
    well as adding how many years ago and how old they were when they made the
    listed films. It also adds how long a go a film was made on a film page.

    This script is not abandoned, email thomas@stewarts.org.uk if it breaks.

    Changelog
    * 2.14 fixed icon, improved getNameDates, new style fixes, reformating
    * 2.13 added https urls, removed scriptvals, fixed title pages
    * 2.12 fixed adding ages to individual films and fixed old style
    * 2.11 fixed date grabbing again
    * 2.10 fixed date grabbing
    * 2.9 fixed adding year to title with many years
    * 2.8 old style working, fixed death day for new style, improved year grabbing
    * 2.7 added persistent config, changed namespace
    * 2.6 fixed star signs and added unicode symbols
    * 2.5 fixed imdb updates
    * 2.4 fixed imdb updates
    * 2.3 improved year grabbing
    * 2.2 updated imdb text info, formatting, added ages to individual films
    * 2.1 Major changes, added signs, added config
    * 1.6 Added improvement ideas from Christopher J. Madsen, Added first imdb text files search, reformatting
    * 1.5 Removed function enclosing while script
    * 1.3 First public version
*/

var doNameAge  = true;
var doNameAges = true;
var doSigns    = true;
var doFilmAge  = true;

// ==UserScript==
// @name        IMDBAge
// @description Adds the age and other various info onto IMDB pages.
// @version     2.14
// @author      Thomas Stewart
// @namespace   http://www.stewarts.org.uk
// @include     http*://*imdb.com/name/*
// @include     http*://*imdb.com/title/*
// @homepageURL https://stewarts.org.uk/project/imdbage/
// @icon        https://stewarts.org.uk/project/imdbage/icon.png
// @license GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/2798/IMDBAge.user.js
// @updateURL https://update.greasyfork.org/scripts/2798/IMDBAge.meta.js
// ==/UserScript==

/*
(https://secure.imdb.com/register-imdb/siteprefs)
Title Test Cases:
plain year              https://www.imdb.com/title/tt0056172/
year range              https://www.imdb.com/title/tt0108757/
year range still open   https://www.imdb.com/title/tt0944947/
year with version       https://www.imdb.com/title/tt1008690/ (dead)

Name Test Cases: (In full for completeness)
Born 18C -> Died 18C    https://www.imdb.com/name/nm1038177/ (Laurence Sterne 54)
Born 18C -> Died 19C    https://www.imdb.com/name/nm0308075/ (Almeida Garrett 55)
Born 18C -> Died 20C    None
Born 18C -> Died 21C    None
Born 18C -> Alive       None

Born 19C -> Died 19C    https://www.imdb.com/name/nm0786564/ (Anna Sewell 58)
Born 19C -> Died 20C    https://www.imdb.com/name/nm0186440/ (Ward Crane 38)
Born 19C -> Died 21C    https://www.imdb.com/name/nm0041807/ (Germaine Auger 112)
Born 19C -> Alive       https://www.imdb.com/name/nm0008724/ (Dawlad Abiad 118)

Born 20C -> Died 20C    https://www.imdb.com/name/nm0001006/ (John Candy 43)
Born 20C -> Died 21C    https://www.imdb.com/name/nm0670239/ (John Peel 65)
Born 20C -> Alive       https://www.imdb.com/name/nm0088127/ (Alexis Bledel 36)

Born 21C -> Died 21C    https://www.imdb.com/name/nm2548643/ (Tabea Block 1)
Born 21C -> Alive       https://www.imdb.com/name/nm1468628/ (Ben Want 15)

Born 31 Dec 1969        https://www.imdb.com/name/nm1009503/ (Taylor McCall 48)
Died 31 Dec 1969        https://www.imdb.com/name/nm0862239/ (Carol Thurston 49)
Born  1 Jan 1970        https://www.imdb.com/name/nm0231191/ (Fiona Dolman 48)
Died  1 Jan 1970        https://www.imdb.com/name/nm0902025/ (Eduard von Borsody 71)

http://us.imdb.com/date/{month}-{day}
http://us.imdb.com/search/name?birth_year={year}

$ curl https://datasets.imdbws.com/name.basics.tsv.gz | gunzip > name.basics.tsv
$ for c in 17 18 19 20; do awk -F'\t' '{print $3 " " $1}' name.basics.tsv | grep ^$c | awk '{print $2}' > b.$c; awk -F'\t' '{print $4 " " $1}' name.basics.tsv | grep ^$c | awk '{print $2}' > d.$c; done
$ cat b.17 d.17 | sort | uniq -d #list of people born and died in 18C
$ wc -l b.17 d.17 b.18 d.18 b.19 d.19 b.20 d.20
    353 b.17
    137 d.17
  37757 b.18
    921 d.18
 471993 b.19
  96672 d.19
   4516 b.20
  86201 d.20
 698550 total
$

*/

/*
TODO: add ages to individual ages of actors to a film page, very hard,
        http req for each one, and then a xpath on the whole result
TODO: add script updater support
*/

/* calculates tropical zodiac sign see http://en.wikipedia.org/wiki/Signs_of_the_Zodiac
input:  month and day
returns: tropical zodiac sign as string */
function tropicalZodiac(month, day) {
        if     (month ==  3 && day >= 21 ||
                month ==  4 && day <= 19) { return "Aries - ♈"; }
        else if(month ==  4 && day >= 20 ||
                month ==  5 && day <= 20) { return "Taurus - ♉"; }
        else if(month ==  5 && day >= 21 ||
                month ==  6 && day <= 20) { return "Gemini - ♊"; }
        else if(month ==  6 && day >= 21 ||
                month ==  7 && day <= 22) { return "Cancer - ♋"; }
        else if(month ==  7 && day >= 23 ||
                month ==  8 && day <= 22) { return "Leo - ♌"; }
        else if(month ==  8 && day >= 23 ||
                month ==  9 && day <= 22) { return "Virgo - ♍"; }
        else if(month ==  9 && day >= 23 ||
                month == 10 && day <= 22) { return "Libra - ♎"; }
        else if(month == 10 && day >= 23 ||
                month == 11 && day <= 21) { return "Scorpio - ♏"; }
        else if(month == 11 && day >= 22 ||
                month == 12 && day <= 21) { return "Sagittarius - ♐"; }
        else if(month == 12 && day >= 22 ||
                month ==  1 && day <= 19) { return "Capricorn - ♑"; }
        else if(month ==  1 && day >= 20 ||
                month ==  2 && day <= 18) { return "Aquarius - ♒"; }
        else if(month ==  2 && day >= 19 ||
                month ==  3 && day <= 20) { return "Pisces - ♓"; }
        else { return ""; }
}

/* calculates chinese zodiac sign see http://en.wikipedia.org/wiki/Chinese_astrology
input:  full year
returns: chinese zodiac sign as string */
function chineseZodiac(year) {
        /* no idea how to work out signs before 20C */
        if (year < 1900) { return ""; }

        /* there are 12 signs that go round in a rotation */
        /* find years since 1900, find modulus of that, get rid of the */
        /* sign(sic) and round it */
        var nsign = Math.round(Math.abs((year - 1900) % 12));

        if      (nsign ==  0) { return "Rat (Metal)"; }
        else if (nsign ==  1) { return "Ox (Metal)"; }
        else if (nsign ==  2) { return "Tiger (Water)"; }
        else if (nsign ==  3) { return "Rabbit/Cat (Water)"; }
        else if (nsign ==  4) { return "Dragon (wood)"; }
        else if (nsign ==  5) { return "Snake (Wood)"; }
        else if (nsign ==  6) { return "Horse (Fire)"; }
        else if (nsign ==  7) { return "Goat (Fire)"; }
        else if (nsign ==  8) { return "Monkey (Earth)"; }
        else if (nsign ==  9) { return "Rooster (Earth)"; }
        else if (nsign == 10) { return "Dog (Metal)"; }
        else if (nsign == 11) { return "Pig/Wild Boar (Metal)"; }
        else { return ""; }
}

/* get dates from a name page
input: born and died called by ref, they are filled with dates from the page
returns: whether they are dead or alive */
function getNameDates(born, died) {
        var alive = true;

        /* if new style */
        if (newStyle()) {
                var nodes = document.evaluate("//script[@type='application/ld+json']",
                        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

                if (nodes.snapshotLength == 1) {
                        jsond = JSON.parse(nodes.snapshotItem(0).firstChild.textContent);

                        /* find the birth date */
                        date = jsond.birthDate.split("-");
                        born.setFullYear(date[0]);
                        born.setMonth(date[1] - 1);
                        born.setDate(date[2]);

                        /* find the death date */
                        date = jsond.deathDate;
                        if(date) {
                                date = date.split("-")
                                died.setFullYear(date[0]);
                                died.setMonth(date[1] - 1);
                                died.setDate(date[2]);
                                alive = false;
                        }

                }
        /* else old style */
        } else {
                /* find the birth date */
                var nodes = document.evaluate(
                        "//div[contains(@class,'info-content')]/a[contains(@href,'birth')]",
                        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                        null);
                if (nodes.snapshotLength == 3) {
                        monthday = nodes.snapshotItem(0).getAttribute("href")
                        month = monthday.substring(28, 30)
                        day = monthday.substring(31, 33)

                        year = nodes.snapshotItem(1).getAttribute("href")
                        year = year.substring(24, 28);

                        born.setFullYear(year);
                        born.setMonth(month - 1);
                        born.setDate(day);
                        alive = true
                }

                /* find the death date */
                var nodes = document.evaluate(
                        "//div[contains(@class,'info-content')]/a[contains(@href,'death')]",
                        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                        null);
                if (nodes.snapshotLength == 2) {
                        monthday = nodes.snapshotItem(0).getAttribute("href")
                        month = monthday.substring(6, 8)
                        day = monthday.substring(09,11)

                        year = nodes.snapshotItem(1).getAttribute("href")
                        year = year.substring(24, 28);

                        died.setFullYear(year);
                        died.setMonth(month - 1);
                        died.setDate(day);
                        alive = false
                }
        }

        //alert("Born: " + born + "\nDied: " + died + "\nAlive: " + alive);
        return alive;
}

/* get dates from a title page
input: none
returns: date of title */
function getTitleDates() {
        var nodes = document.evaluate("//h4[text()='Release Date:']",
                document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (nodes.snapshotLength == 1) {
                date = nodes.snapshotItem(0).nextSibling.textContent;
        }

        var nodes = document.evaluate("//a[text()='Release date']",
                document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (nodes.snapshotLength == 1) {
                date = nodes.snapshotItem(0).nextSibling.textContent;
        }

        titledate = new Date(Date.parse(date));

        //alert("Year: " + titledate.getFullYear())
        return titledate;
}

/* add age of person to page
input: alive status, and dates
returns: none */
function addAge(alive, born, died) {
        var justyear;

        /* find the difference between two times */
        var age;
        if (died == undefined) {
                age = new Date() - born.getTime();
        } else {
                age = died.getTime() - born.getTime();
        }

        //alert("Born: " + born + "\nDied: " + died + "\nAlive: " + alive);

        /* convert difference into years */
        age = age / (1000 * 60 * 60 * 24 * 365.242199);

        /* get nice values */
        var years =  Math.floor( age );
        var months = Math.floor( (age - years) * 12 );

        var nodes = document.evaluate("//a[contains(@href,'/date')]",
                document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        /* only print the year if there aren't dates */
        if ((alive == true && nodes.snapshotLength == 1) ||
            (alive == false && nodes.snapshotLength == 2)) {
                justyear = false;
        } else {
                justyear = true;
        }

        /* loop over all the a tags involving dates */
        var nodes = document.evaluate(
                "//a[contains(@href,'birth_year')] | //a[contains(@href,'death_date')]",
                document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        /* only count months if we found month & day info */
        var container = document.createTextNode(
                " (Age: " + years + " year" + (years == 1 ? '' : 's') +
                (!justyear ? ", " + months + " month" + (months == 1 ? '' : 's') : '') + ")");

        /* loop over all dates */
        if (alive == true) {
                node = nodes.snapshotItem(0);
                node.parentNode.insertBefore(container, node.nextSibling);
        } else {
                node = nodes.snapshotItem(1);

                //only add death age on old layout, as new layout has it!
                if (!newStyle()) {
                        node.parentNode.insertBefore(container, node.nextSibling);
                }
        }
}

/* add age of film and the age of the actor when they were in the film
input: date
returns: none */
function addAges(born) {
        //find all the films, this in includes things like producer and writer
        var nodes = document.evaluate(
                /* new style and old style */
                "//span[contains(@class,'year_column')]|//div[@id='tn15content']/div/ol/li",
                document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        //loop round each film
        for (var i = 0; i < nodes.snapshotLength; i++) {
                var node = nodes.snapshotItem(i);
                //extract the year of the film depending on style
                if (newStyle()) {
                        yearindex = node.innerHTML.search("[1-2][0-9]{3}")
                        //if we don't find a year, continue with for loop
                        if (yearindex < 0) {
                                continue;
                        }
                } else {
                        yearindex = node.innerHTML.search(
                                "[1-2][0-9]{3}[/I]{0,2}[)]")
                }
                var filmborn = node.innerHTML.substring(yearindex,
                        yearindex + 4);
                //alert(filmborn);

                //calculate ages
                var filmage = new Date().getFullYear() - filmborn;
                var age = filmborn - born;
                age = new String(age +
                        " year" + (age == 1 ? '' : 's') + " old");

                //get them in a nice format
                if (filmage < 0) {
                        var agetxt = new String(
                                "in " +
                                Math.abs(filmage) + " year" +
                                (Math.abs(filmage) == 1 ? '' : 's') +
                                " will be " + age);
                }
                if (filmage == 0) {
                        var agetxt = new String(
                                "this year while " + age);
                }
                if (filmage > 0) {
                        var agetxt = new String(
                                Math.abs(filmage) + " year" +
                                (Math.abs(filmage) == 1 ? '' : 's') +
                                " ago while " + age);
                }

                //if(i == 4) { alert(agetxt); }
                /* add in age text */
                node.innerHTML = node.innerHTML.substring(0,yearindex)
                        + agetxt + ", " + node.innerHTML.substring(yearindex)
        }
}

/* adds signs to page
input: date person is born
returns: none */
function addSigns(born) {
        /* find place to stick the info */
        var nodes = document.evaluate( "//a[contains(@href,'birth_year')]",
                document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        /* make a node with info in */
        var container = document.createTextNode(
                ", Tropical Zodiac Sign: " + tropicalZodiac(born.getMonth() + 1, born.getDate()) +
                ", Chinese Zodiac Sign: " + chineseZodiac(born.getFullYear())
                );

        /* should be the first occurance of the latter */
        var node = nodes.snapshotItem(0);

        /* attach it */
        if (nodes.snapshotLength > 0) {
                node.parentNode.insertBefore(container, node.nextSibling);
        }
}

/* add the age of the film to the page
input: date of film
returns: none */
function addFilmAge(filmAge) {
        /* calc age */
        var age = new Date().getFullYear() - filmAge.getFullYear();

        /* only print if age is 1 or over */
        if (age >= 1) {
                /* make a node with info in */
                var container = document.createTextNode(", " +
                        age +
                        " year" + (age == 1 ? '' : 's') +
                        " ago");
        }
        if (age == 0) {
                var container = document.createTextNode(", This year");
        }
        if (age <= -1) {
                var container = document.createTextNode(", in " +
                        Math.abs(age) +
                        " year" + (Math.abs(age) == 1 ? '' : 's'));
        }

        /* find place to stick the info */
        var nodes = document.evaluate(
                /* old style and new style */
                "//div[contains(@id,'tn15title')]//a[contains(@href,'year')]|//div[@class='subtext']/a[@title='See more release dates']|//div[contains(@class,'TitleBlock__TitleMetaDataContainer')]/ul/li",
                document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        /* create new span with formatting to match */
        var span = document.createElement('span');
        span.style.fontSize = "11px";
        span.appendChild(container);

        /* should be the first occurrence of the latter */
        var node = nodes.snapshotItem(0);
        /* attach it */
        node.parentNode.insertBefore(span, node.nextSibling);
}

/* find out if we are using the newstyle on not, works on name and title pages
input: none
returns: true if using the new style */
function newStyle() {
        var nodes = document.evaluate( "//div[@id='tn15content']", document,
                null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (nodes.snapshotLength == 1) {
                return false
        } else {
                return true
        }
}

/* code starts, two options, either it is a name page ... */
if (window.location.href.indexOf('name') != -1) {
        born = new Date();
        died = new Date();
        /* get needed dates */
        var alive = getNameDates(born, died);

        /* add wanted bits */
        if(doSigns == true) {
                addSigns(born);
        }
        if(doNameAge == true) {
                addAge(alive, born, died);
        }
        if(doNameAges == true) {
                addAges(born.getFullYear());
        }

/* ... or it is a title page */
} else if (window.location.href.indexOf('title') != -1) {
        /* get needed dates */
        filmAge = getTitleDates();

        /* add wanted bits */
        if(doFilmAge == true && typeof(filmAge) == "object") {
                addFilmAge(filmAge);
        }
}
