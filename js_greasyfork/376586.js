// ==UserScript==
// @name         Tomuss average
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  An average calculator for IUT Lyon 1 students, semester 1, 2018
// @author       Codinget (natnat-mc)
// @match        https://tomusss.univ-lyon1.fr/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      dsidev3.univ-lyon1.fr
// @downloadURL https://update.greasyfork.org/scripts/376586/Tomuss%20average.user.js
// @updateURL https://update.greasyfork.org/scripts/376586/Tomuss%20average.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const regex={
        outof: /^([+-]?\d+(?:\.\d+)?)\/(\d+)$/, // grades with a denominator
        interval: /^([+-]?\d+(?:\.\d+)?)\[([+-]?\d+(?:\.\d+)?);([+-]?\d+(?:\.\d+)?)\]$/, // grades with an interval
        pu: /var\s+_PU_\s*=\s*"([^"]+)"\s*;/ // the _PU_ variable for the other grades' URI
    };


    // inject the CSS
    (() => {
        let css='.TooltipParent {\n';
        css+='\tposition: relative;\n';
        css+='\toverflow: visible;\n';
        css+='}\n';
        css+='.TooltipParent .Tooltip {\n';
        css+='\topacity: 0;\n';
        css+='\tdisplay: block;\n';
        css+='\ttransition: opacity .5s;\n';
        css+='\tposition: absolute;\n';
        css+='\twidth: 10em;\n';
        css+='\tleft: -1000vh;\n';
        css+='\tpadding: 3px 1em;\n';
        css+='\tcolor: #aaa;\n';
        css+='\tbackground-color: #333;\n';
        css+='\tborder-radius: 5px;\n';
        css+='\ttext-align: center;\n';
        css+='}\n';
        css+='.TooltipParent:hover .Tooltip, .TooltipParent .Tooltip:hover {\n';
        css+='\topacity: 1;\n';
        css+='\tdisplay: block;\n';
        css+='\tz-index: 100;\n';
        css+='\tleft: -4em;\n';
        css+='\tbottom: 2em;\n';
        css+='}\n';
        css+='.TooltipParent:hover .Tooltip.TooltipRight, .TooltipParent .Tooltip.TooltipRight:hover {\n';
        css+='\tleft: 5em;\n';
        css+='\tbottom: -1em;\n';
        css+='}\n';
        css+='.AverageList {\n';
        css+='\twidth: 100%;\n';
        css+='}';
        GM_addStyle(css);
    })();

    // target all the parts
    let parts=Array.from(document.querySelectorAll('.UEGrades'));

    // keep only the parts with grades in them
    parts=parts.filter(part => {
        return Array.from(part.querySelectorAll('.DisplayTypeNote')).map(cell => {
            return cell.querySelector('.CellValue');
        }).map(cell => {
            return cell.innerText;
        }).filter(grade => {
            return grade.trim();
        }).length!=0;
    });

    // keep only the parts with no nested parts
    parts=parts.filter(part => {
        return part.querySelectorAll('.UEGrades').length==0;
    });

    // make part objects
    const UEs=parts.map(part => {
        let obj={};

        // add the element
        (() => {
            obj.element=part;
        })();

        // add the source
        (() => {
            obj.source='Tomuss';
        })();

        // find the names
        (() => {
            const previous=part.previousElementSibling;
            if(!previous) return;
            const title=previous.querySelector('.UETitle');
            if(!title) return;
            obj.name=title.innerText;
        })();

        // find the grades
        (() => {
            obj.grades=Array.from(part.querySelectorAll('.DisplayTypeNote')).map(cell => {
            return cell.querySelector('.CellValue');
            }).map(cell => {
                return cell.innerText;
            }).filter(grade => {
                return grade.trim();
            }).map(grade => {
                if(regex.outof.test(grade)) {
                    let [_, a, b]=regex.outof.exec(grade);
                    return {
                        type: 'normal',
                        value: +a/+b
                    };
                } else if(regex.interval.test(grade)) {
                    let [_, a, b, c]=regex.interval.exec(grade);
                    return {
                        type: 'bonus',
                        value: +a,
                        range: [+b, +c]
                    };
                }
                return false;
            });
        })();

        // sort the grades between normal and bonuses
        (() => {
            obj.normalGrades=obj.grades.filter(grade => {
                return grade && grade.type=='normal';
            }).map(grade => {
                return grade.value;
            });
            obj.bonusGrades=obj.grades.filter(grade => {
                return grade && grade.type=='bonus';
            }).map(grade => {
                return grade.value;
            });
        })();

        // calculate average, bonus and total score
        (() => {
            obj.average=(obj.normalGrades.reduce((a, b) => a+b, 0)/obj.normalGrades.length)*20;
            obj.bonus=obj.bonusGrades.length==0?0:obj.bonusGrades.reduce((a, b) => a+b, 0)/obj.bonusGrades.length;
            obj.total=obj.average+obj.bonus;
        })();

        return obj;
    });

    // push the grades into the container
    UEs.forEach(ue => {
        let cell=document.createElement('div');
        cell.classList.add('Display', 'DisplayCellBox', 'CellBox', 'DisplayTypeNote', 'CustomAverage', 'TooltipParent');
        let h=ue.total<10?0:120;
        let s=100;
        let l=100-Math.abs(ue.total-10)*5;
        cell.style.backgroundColor='hsl('+h+','+s+'%,'+l+'%)';

        let title=cell.appendChild(document.createElement('div'));
        title.classList.add('Display', 'DisplayCellTitle', 'CellTitle');
        title.innerText='Average';

        let value=cell.appendChild(document.createElement('div'));
        value.classList.add('Display', 'DisplayCellValue', 'CellValue');
        value.innerText=ue.total.toFixed(2);

        let denominator=value.appendChild(document.createElement('small'));
        denominator.style.fontSize='60%';
        denominator.innerText='/20';

        let tooltip=cell.appendChild(document.createElement('span'));
        tooltip.classList.add('Tooltip');
        tooltip.innerText="Average: "+ue.average.toFixed(3);
        if(ue.bonusGrades.length) tooltip.innerText+="\nBonus: "+ue.bonus.toFixed(3)+"\nTotal: "+ue.total.toFixed(3);

        ue.element.prepend(cell);
    });

    // try loading the other grades
    (() => {
        // what to do on error
        function xhrFail(err) {
            console.error(err);
        }

        // open an XHR as a Promise
        function xhrPromise(params) {
            let p=Object.assign({
                method: 'GET'
            }, params);
            let _ok, _ko;
            let pr=new Promise((ok, ko) => {
                _ok=ok;
                _ko=ko;
            });
            if(p.onload) {
                let h=p.onload;
                p.onload=xhr => {
                    _ok(xhr);
                    h(xhr);
                };
            } else {
                p.onload=_ok;
            }
            if(p.onerror) {
                let h=p.onerror;
                p.onerror=err => {
                    _ko(err);
                    h(err);
                };
            } else {
                p.onerror=_ko;
            }
            GM_xmlhttpRequest(p);
            return pr;
        }

        // the URL holder
        let _url;

        // request the first page
        xhrPromise({
            url: 'https://dsidev3.univ-lyon1.fr/WD210AWP/WD210Awp.exe/CONNECT/IUT_Note_Etudiant'
        }).then(xhr => {
            // parse it to get the real URL
            let match=regex.pu.exec(xhr.responseText);
            if(!match) throw new Error("Couldn't extract URL");
            _url='https://dsidev3.univ-lyon1.fr'+match[1];

            // generate the query string
            let name=localStorage.getItem('name');
            let email=localStorage.getItem('email');
            let id=localStorage.getItem('id');
            if(!name) {
                let f=prompt('First name');
                let s=prompt('Last name');
                name=s.toUpperCase()+' '+f.toUpperCase();
                localStorage.setItem('name', name);
            }
            if(!email) {
                email=prompt('IUT Email');
                localStorage.setItem('email', email);
            }
            if(!id) {
                id=prompt('Student ID');
                id=id.replace('p', '1');
                localStorage.setItem('id', id);
            }
            let qs='WD_ACTION_=AJAXPAGE&EXECUTE=47';
            qs+='&WD_CONTEXTE_=A33';
            qs+='&WD_BUTTON_CLICK_=';
            qs+='&A9=1';
            qs+='&A9_DEB=1';
            qs+='&_A9_OCC=1';
            qs+='&A33=3';
            qs+='&A7=-1';
            qs+='&A7_DEB=1';
            qs+='&_A7_OCC=1';
            qs+='&A16='+encodeURIComponent(name);
            qs+='&A3='+encodeURIComponent(email);
            qs+='&A4=2018';
            qs+='&A8='+encodeURIComponent(id);
            qs+='&A27=-1';
            qs+='&A27_DEB=1';
            qs+='&_A27_OCC=49'

            // send the action to get the first semester
            return xhrPromise({
                url: _url,
                method: 'POST',
                data: qs
            });
        }).then(xhr => {

            // send the action to get the averages
            return xhrPromise({
                url: _url,
                method: 'POST',
                data: 'WD_ACTION_=AJAXEXECUTE&LIGNESTABLE=A7&0=142'
            });
        }).then(xhr => {
            // parse the XML and read the averages
            let xml=xhr.responseXML;
            let lines=Array.from(xml.querySelectorAll('LIGNE'));

            let parts=lines.map(line => {
                let columns=Array.from(line.querySelectorAll('COLONNE')).map(a => a.textContent.trim());
                return {
                    name: columns[1],
                    type: columns[2],
                    total: (isNaN(+columns[3])||columns[3]==='')?false:+columns[3],
                    average: (isNaN(+columns[3])||columns[3]==='')?false:+columns[3],
                    columns,
                    source: 'external(IUT)'
                };
            }).filter(part => {
                return part.total!==false;
            }).forEach(part => {
                UEs.push(part);
            });

            console.log(parts);

        }).then(() => {
            // create a container for the averages
            const container=document.createElement('table');
            container.classList.add('AverageList');

            // add the header row
            (() => {
                const header=container.appendChild(document.createElement('tr'));
                header.appendChild(document.createElement('th')).innerText='Subject';
                header.appendChild(document.createElement('th')).innerText='Source';
                header.appendChild(document.createElement('th')).innerText='Average';
            })();

            // add the other rows
            (() => {
                function add(ue) {
                    const row=container.appendChild(document.createElement('tr'));

                    let subject=row.appendChild(document.createElement('td'));
                    subject.innerText=ue.name;
                    subject.classList.add('TooltipParent');
                    let subTT=subject.appendChild(document.createElement('span'));
                    subTT.innerText=ue.name;
                    subTT.classList.add('Tooltip', 'TooltipRight');

                    let source=row.appendChild(document.createElement('td'));
                    source.innerText=ue.source;
                    source.classList.add('TooltipParent');
                    let srcTT=source.appendChild(document.createElement('span'));
                    srcTT.innerText=ue.source;
                    srcTT.classList.add('Tooltip');

                    let avg=row.appendChild(document.createElement('td'));
                    avg.innerText=ue.total.toFixed(2);
                    avg.classList.add('TooltipParent');
                    avg.appendChild(document.createElement('small')).innerText='/20';
                    let avgTT=avg.appendChild(document.createElement('span'));
                    avgTT.innerText='Average: '+ue.average.toFixed(3);
                    if(ue.bonus) {
                        avgTT.innerText+='\nBonus: '+ue.bonus.toFixed(3)+'\nTotal: '+ue.total.toFixed(3);
                    }
                    avgTT.classList.add('Tooltip');
                }

                UEs.forEach(add);
            })();

            // insert the container somewhere in the DOM
            (() => {
                const gradeC=document.querySelector('.Display.DisplayGrades.Grades');
                gradeC.prepend(container);
                gradeC.prepend(document.createElement('hr'));
            })();

        }).catch(xhrFail);
    })();
})();
