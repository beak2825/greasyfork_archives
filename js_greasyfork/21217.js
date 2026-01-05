// ==UserScript==
// @name           KoL Detective Helper
// @namespace      kol.interface.unfinished
// @description    Helps with solving the detective school puzzles in Kingdom of Loathing
// @include        https://*kingdomofloathing.com/wham.php*
// @grant          GM_setValue
// @grant          GM_getValue
// @version        1.2
// @downloadURL https://update.greasyfork.org/scripts/21217/KoL%20Detective%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/21217/KoL%20Detective%20Helper.meta.js
// ==/UserScript==

// Version 1.2
// - highlight areas on hover over questions
// Version 1.1
// - include possible responses in lists of people and jobs, so they can be recognized in answers prior to visiting
// Version 1.0.1
// - highlight active row better
// Version 1.0

var titleKey;
var places;
var person;
var people;
var jobs;
var personPlaceJob = {};
var personSays = {};

function getTitle() {
	var t = document.evaluate( '//b[contains(.,"Who killed ")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
	if (t.singleNodeValue) {
        var title = t.singleNodeValue.innerHTML;
        // console.log('title is '+title);
        titleKey = title;
	    var tt = document.evaluate( '//td[contains(.,"You have been on this case for ")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
	    if (tt.singleNodeValue) {
            var re = tt.singleNodeValue.innerHTML.match(/You have been on this case for ([0-9][0-9]*) minute/);
            if (re) {
                var mins = re[1];
                // console.log('minutes is '+mins);
                if (mins!=0) 
                    getTruthAndLies();
            }
        }
    }
}

function gatherLocations() {
    var rc = [];
	var locs = document.evaluate( '//a[contains(@href,"wham.php?visit=")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
    for (var i=0;i<locs.snapshotLength;i++) {
        var loc = locs.snapshotItem(i);
        var aloc = loc.firstChild.firstChild.innerHTML;
        rc[rc.length] = aloc;
        // console.log('location: '+aloc);
    }
    return rc;
}

function gatherPeople() {
    var rc = [];

    for (var p in personPlaceJob) {
        rc[rc.length] = p;
    }

    return rc;
}

function gatherJobs() {
    var rc = [];

    for (var p in personPlaceJob) {
        rc[rc.length] = personPlaceJob[p].job;
    }

    return rc;
}

function highlightHover(e) {
    var tgt = this.getAttribute('tgt');
    var tgtnode = document.evaluate( '//a[@href="wham.php?visit='+tgt+'"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,null);
    if (tgtnode.singleNodeValue) {
        tgtnode.singleNodeValue.setAttribute('style','color:blue;');
        tgtnode.singleNodeValue.firstChild.setAttribute('size','3');
    }
}

function unhighlightHover(e) {
    var tgt = this.getAttribute('tgt');
    var tgtnode = document.evaluate( '//a[@href="wham.php?visit='+tgt+'"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,null);
    if (tgtnode.singleNodeValue) {
        tgtnode.singleNodeValue.setAttribute('style','');
        tgtnode.singleNodeValue.firstChild.setAttribute('size','2');
    }
}

function gatherMorePeople(people) {
    var re = /^[A-Z][a-z][A-Za-z]* [A-Z][a-z][A-Za-z]*(\s[A-Z][a-z][A-Za-z]*)?$/;
    var rea = /^wham\.php\?ask=([1-9])/;
    var asks = document.evaluate( '//a[contains(@href,"wham.php?ask=")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
    for (var i=0;i<asks.snapshotLength;i++) {
        var a = asks.snapshotItem(i);
        var subj = a.innerHTML;
        if (subj.match(re)) {
            if (people.indexOf(subj)<0) {
                people[people.length] = subj;
            }
            //console.log('Extra person: '+subj);
        }
        var m = a.getAttribute('href').match(rea);
        if (m) {
            a.setAttribute('tgt',m[1]);
            a.addEventListener('mouseover',highlightHover,false);
            a.addEventListener('mouseout',unhighlightHover,false);
        }
    }
}

function gatherMoreJobs(jobs) {
    var re = /^the victim's ([-a-z ]*)$/;
    var rea = /^wham\.php\?ask=rel&w=([1-9])/;
    var asks = document.evaluate( '//a[contains(@href,"wham.php?ask=rel")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
    for (var i=0;i<asks.snapshotLength;i++) {
        var a = asks.snapshotItem(i);
        var subj = a.innerHTML;
        var w = subj.match(re);
        if (w) {
            if (jobs.indexOf(w[1])<0) {
                jobs[jobs.length] = w[1];
                //console.log('Extra job: '+w[1]);
            }
        }
        var m = a.getAttribute('href').match(rea);
        if (m) {
            a.setAttribute('tgt',m[1]);
            a.addEventListener('mouseover',highlightHover,false);
            a.addEventListener('mouseout',unhighlightHover,false);
        }
    }
}

// -------------------------------------------------

function gatherPerson() {
	var p = document.evaluate( '//input[@value="Accuse!"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
	if (p.singleNodeValue) {
	    p = document.evaluate( './/b', p.singleNodeValue.parentNode.parentNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        if (p.singleNodeValue) {
            person = p.singleNodeValue.innerHTML;
            var role = String(p.singleNodeValue.nextSibling.nextSibling.nextSibling.nodeValue).trim();
            var loc = String(p.singleNodeValue.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML).trim().replace(")","").replace("(","");
            //console.log(person+', '+role+' is at '+loc);

            var peep = personPlaceJob[person];
            if (peep) {
                peep.job = role;
                peep.place = loc;
            } else {
                personPlaceJob[person] = {
                    job:role,
                    place:loc
                };
            }
            if (people.indexOf(person)<0)
                people[people.length] = person;
            if (jobs.indexOf(role)<0)
                jobs[jobs.length] = role;
            //console.log('Person: '+person);
        } 
    } 
}

function gatherAnswer(person) {
    if (!person) {
        return;
    }
 	var a = document.evaluate( '//td[@colspan="2" and @width="500"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
 	if (a.singleNodeValue) {
        var t = a.singleNodeValue.innerHTML;
        var p,l,j;

        var accused = checkAccused(t);
        //console.log('accused? ' + accused);

        for (var i in people) {
            var re = new RegExp('\\b'+people[i]+'\\b');
            if (re.test(t)) {
                p = people[i];
                //console.log('Talking about person '+p);
            }
        }

        for (var i in places) {
            var re = new RegExp('\\b'+places[i]+'\\b');
            if (re.test(t)) {
                if (!l || l.length<places[i].length) {
                    l = places[i];
                }
                //console.log('Talking about location '+l);
            }
        }

        var ts = t.replace(/I don't know how s*he got stuck with [a-z -]* like me, either\./,'');
        // console.log('looking for jobs');
        for (var i in jobs) {
            var re = new RegExp('\\b'+jobs[i]+'\\b');
            var w = ts.search(re);
            if (w>=3 && ts.substr(w-3,3).toLowerCase()!="ex-") {
                if (!j || j.length<jobs[i].length) {
                    j = jobs[i];
                }
                // console.log('Talking about job '+j);
            }
        }

        var map = personSays[person];
        if (!map) {
            map = new Object();
            personSays[person] = map;
        }
        if (p && l) {
            //console.log(p + ' -> ' + l);
            map[p+'.place'] = l;
        }
        if (p && j) {
            //console.log(p + ' -> ' + j);
            map[p+'.job'] = j;
        }
        if (l && j) {
            //console.log(l + ' -> ' + j);
            map[l] = j;
        }
        if (accused) {
            if (p) map.accused = p;
            else if (j) map.accused = j;
            else map.accused = 'n/a';
        }
    } 
}

function checkAccused(text) {
    var re = /("Do you have any thoughts on who did it\?" you ask.|"Help me out here," you say\. "You know all the people in this house. Who's the most likely killer\?"|"Who do you think is the most likely to be the killer\?" you ask\.|"Who do you think the killer is\?" you ask.|"Does anyone else here seem particularly suspicious to you\?" you ask\.|"If you had to guess," you ask, "who would you say did it\?")/;

    return re.test(text);
}

// -------------------------------------------------

function saveTruthAndLies() {
    GM_setValue('truth',JSON.stringify(personPlaceJob));
    GM_setValue('lies',JSON.stringify(personSays));
    // var i = 1;
    // // console.log('Truth:');
    // for (var p in personPlaceJob) {
    //     console.log(i+'. '+p+': '+personPlaceJob[p].job+', '+personPlaceJob[p].place);
    //     i = i+1;
    // }
    // // console.log('Lies:');
    // i = 1;
    // for (var p in personSays) {
    //     var ps = personSays[p];
    //     var s = '';
    //     for (var rel in ps) {
    //         if (s)
    //             s += ', ';
    //         s += rel+':'+ps[rel];
    //     }
    //     console.log(i+'. '+p+' says '+s);
    //     i = i+1;
    // }
}

function getTruthAndLies() {
    var t = GM_getValue('truth','');
    if (t) {
        personPlaceJob = JSON.parse(t);
    }
    var lies = GM_getValue('lies','');
    if (lies) {
        personSays = JSON.parse(lies);
    }
}

function abbreviateName(name) {
    var re = /^([A-Z])[a-zA-Z]* ([A-Z])[a-zA-Z]*(\s?([A-Z]))?/;
    var m = name.match(re);
    if (m) {
        if (m[4])
            return m[1]+m[2]+m[4];
        return m[1]+m[2];
    }
    return name;
}

function display() {
    var tbl = document.createElement('table');
    tbl.setAttribute('style','width:95%;font-size:9pt;border-collapse:collapse;border:1px solid black;');
    tbl.setAttribute('cellpadding','3');
    tbl.setAttribute('cellspacing','2');

    // headers
    var c,r = tbl.insertRow();
    r.setAttribute('style','border:1px solid black;');
    c = r.insertCell();
    c.appendChild(document.createTextNode('Perp'));

    for (var ppl in people) {
        var name = abbreviateName(people[ppl]);
        c = r.insertCell();
        c.appendChild(document.createTextNode(name));
        // c = r.insertCell();
        // c.appendChild(document.createTextNode(name));
    }
    for (var loc in places) {
        c = r.insertCell();
        c.appendChild(document.createTextNode(places[loc]));
    }
    c = r.insertCell();
    c.appendChild(document.createTextNode('Acc'));

    for (var p in personSays) {
        r = tbl.insertRow();
        var rattrib = "border:1px solid black;";
        
        c = r.insertCell();
        if (p==person) {
            var b = document.createElement('b');
            b.appendChild(document.createTextNode(p));
            c.appendChild(b);
            rattrib = rattrib + "background-color:rgb(250,230,230);";
        } else {
            c.appendChild(document.createTextNode(p));
        }
        r.setAttribute('style',rattrib);
        c.appendChild(document.createElement('br'));
        if (personPlaceJob[p] && personPlaceJob[p].place) {
            var b = document.createElement('div');
            b.setAttribute('style','font-size:smaller;');
            if (personPlaceJob[p].job) {
                b.appendChild(document.createTextNode(personPlaceJob[p].job));
                b.appendChild(document.createElement('br'));
            }
            b.appendChild(document.createTextNode(personPlaceJob[p].place));
            c.appendChild(b);
        }
        
        for (var ppl in people) {
            c = r.insertCell();
            var place = personSays[p][people[ppl]+'.place'];
            if (place) {
                var d = document.createElement('div');
                // check truth
                if (personPlaceJob[people[ppl]] && personPlaceJob[people[ppl]].place) {
                    // we know this association
                    if (personPlaceJob[people[ppl]].place==place) {
                        d.setAttribute('style','color:green;border-bottom:1px solid black;');
                    } else {
                        d.setAttribute('style','color:red;border-bottom:1px solid black;');
                    }
                } else {
                    d.setAttribute('style','color:gray;border-bottom:1px solid black;');
                }
                d.appendChild(document.createTextNode(place));
                c.appendChild(d);
            } else {
                c.appendChild(document.createElement('br'));
            }

            //c = r.insertCell();
            //c.appendChild(document.createElement('br'));
            var job = personSays[p][people[ppl]+'.job'];
            if (job) {
                var d = document.createElement('div');
                // check truth
                if (personPlaceJob[people[ppl]] && personPlaceJob[people[ppl]].job) {
                    if (personPlaceJob[people[ppl]] && personPlaceJob[people[ppl]].job==job) {
                        d.setAttribute('style','color:green;border-top:1px solid black;');
                    } else {
                        d.setAttribute('style','color:red;border-top:1px solid black;');
                    }
                } else {
                    d.setAttribute('style','color:gray;border-top:1px solid black;');
                }
                d.appendChild(document.createTextNode(job));
                c.appendChild(d);
            } else {
                c.appendChild(document.createElement('br'));
            }
        }
        for (var loc in places) {
            c = r.insertCell();
            var job = personSays[p][places[loc]];
            if (job) {
                var d = document.createElement('div');
                d.setAttribute('style','color:gray;');
                // check truth
                for (var others in personPlaceJob) {
                    var other = personPlaceJob[others];
                    if (other.job==job && other.place) {
                        if (other.place==places[loc]) {
                            d.setAttribute('style','color:green;');
                        } else {
                            d.setAttribute('style','color:red;');
                        }
                        break;
                    } else if (other.place==places[loc] && other.job) {
                        if (other.job==job) {
                            d.setAttribute('style','color:green;');
                        } else {
                            d.setAttribute('style','color:red;');
                        }
                        break;
                    }
                }
                d.appendChild(document.createTextNode(job));
                c.appendChild(d);
            }
        }
        c = r.insertCell();
        if (personSays[p].accused) {
            c.appendChild(document.createTextNode(personSays[p].accused));
        }
    }
    document.body.appendChild(tbl);
}
    
// -------------------------------------------------

getTitle();
places = gatherLocations();
people = gatherPeople();
jobs = gatherJobs();
gatherPerson();
gatherMorePeople(people);
gatherMoreJobs(jobs);
gatherAnswer(person);
saveTruthAndLies();
display();
