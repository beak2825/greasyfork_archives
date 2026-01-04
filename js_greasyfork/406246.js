// ==UserScript==
// @name         UOWD Sols 2.0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  very awesome big
// @author       You
// @match       https://solss.uow.edu.au/sid/sols_Assignment_Result.*
// @match      https://solss.uow.edu.au/sid/sols_assignment_result.call_main?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406246/UOWD%20Sols%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/406246/UOWD%20Sols%2020.meta.js
// ==/UserScript==

(function() {
   class Subject{
    constructor(name, marks, weights){
        this.name = name;
        this.marks = marks;
        this.weights = weights;

        this.elements = {
            wam: null,
            weight: null,
            remaining: null
        };
    }

    calculateWam(credits = 6){
        if (this.marks.length > 0 && this.weights.length > 0){
            var wam = 0;
            for (var c = 0; c < this.marks.length; c++){
                wam += this.marks[c] * this.weights[c];
            }
            wam /= sum(this.weights);
            wam = (wam * credits) / credits;
            wam = Math.round(10*(wam))/10;
            return wam;
         }
         return 0;
    }

    calculateWeight(){
        return this.weights.length > 0 ? sum(this.weights) : 0;
    }

    refreshResult(){
        var totalWeight = this.calculateWeight();
        var wam = this.calculateWam();
        this.elements["name"].innerHTML = bolded(this.name);
        this.elements["wam"].innerHTML = bolded(wam + "%");

        var weight = this.elements["weight"];
        var remaining = this.elements["remaining"];
        if (totalWeight < 100){
            weight.style.color = "red";
            weight.innerHTML = bolded(totalWeight + "/100");
            if (remaining.innerText.length == 0){
                remaining.appendChild(createRemaining(100 - totalWeight, this));
            }
        }
        else {
            weight.innerHTML = bolded(totalWeight + "%");
            weight.style.color = "green";
        }
    }
}

const average = arr => arr.reduce((a, b) => a + b, 0)/arr.length;
const sum = arr => arr.reduce((a,b) => a + b, 0);
const pick = (arr, n) => arr.map(x => x[n]);
const bolded = str => "<b>"+str+"</b>";
const giveColor = (str, color) => "<font color='"+color+"'>"+str+"</font>"
var tables = document.getElementsByClassName("table table-striped table-bordered");
var subjects = new Array();

for (var i = 0; i < tables.length; i++){
    if (tables[i].rows.length >= 2 &&
        tables[i].rows[1].cells[0].innerText.toLocaleLowerCase() != "not available"){
        var row = tables[i].insertRow(),
        _name = row.insertCell(0),
        _grades = row.insertCell(1),
        _weight = row.insertCell(2);
        row.insertCell(3);
        var parent = document.getElementById("content");
        var strongs = parent.querySelectorAll("strong");
        var name = strongs[i+2].innerText.split('(')[0].trim();
        var subject = new Subject(name, new Array(), new Array());
        var totalMark = 0;
        for (var a = 1; a < tables[i].rows.length; a++){
            var currentRow = tables[i].rows[a];
            if (currentRow.cells[1].innerText && currentRow.cells[2].innerText){
                subject.marks.push(markToPercent(currentRow.cells[1].innerText));
                subject.weights.push(parseInt(currentRow.cells[2].innerText.slice(0, -1)));
            }
        }
        subjects.push(subject);
        _name.innerHTML = bolded("Total Grades:");
        _grades.innerHTML = bolded(subject.calculateWam()) + "%";
        _weight.innerHTML = bolded(subject.calculateWeight() + "%");
    }
}

addResults();
function markToPercent(mark){
    var splitted = mark.split('/');
    return splitted.length > 1 ? ((parseInt(splitted[0]) / parseInt(splitted[1])) * 100) : 0;
}

function duplicateElements(value, times) {
    var result = new Array();
    for (var i =0; i < times; i++){
        result.push(value.cloneNode(true));
    }
    return result;
  }

function addResults(){
    if (subjects.length > 0) {
        var elm = document.createElement("table");
        var clone = duplicateElements(tables[1].querySelector("th").cloneNode(true), 4);
        clone[0].innerText = "Subject";
        clone[1].innerText = "WAM based on current variables";
        clone[2].innerText = "Total Weight";
        clone[3].innerText = "Predict Remaining";
        clone.forEach(
            f => {
                elm.appendChild(f).cloneNode(true);
            }
        )
        elm.setAttribute("class", "table table-striped table-bordered");
        var rows = new Array(),
        cells = new Array();
        for (var i = 0; i < subjects.length; i++){
            rows.push(elm.insertRow());
            cells.push(
                [rows[i].insertCell(0),
                    rows[i].insertCell(1),
                    rows[i].insertCell(2),
                    rows[i].insertCell(3)
                ]
            )
            subjects[i].elements["name"] = cells[i][0];
            subjects[i].elements["wam"] = cells[i][1];
            subjects[i].elements["weight"] = cells[i][2];
            subjects[i].elements["remaining"] = cells[i][3];
            subjects[i].refreshResult();
        }

        document.getElementById("content").appendChild(elm);
    }
}

function createRemaining(remaining, subject){
    var parent = document.createElement("div");

    var input = document.createElement("INPUT");
    var max = 100, min = 0;
    input.setAttribute("type", "number");
    input.setAttribute("max", max);
    subject.weights.push(remaining);
    subject.marks.push(0);
    input.setAttribute("min", min);
    input.addEventListener("change", function(){
        if (input.value > max){
            input.value = max;
        } else if (input.value < min){
            input.value = min;
        }

        if (!input.value && subject.calculateWeight() == 100) {
            subject.marks.pop();
            subject.weights.pop();
        } else if (input.value){
            if (subject.calculateWeight() < 100){
                subject.weights[subject.weights.length] = remaining;
                subject.marks[subject.marks.length] = parseInt(input.value);
            }
            else
                subject.marks[subject.marks.length - 1] = parseInt(input.value);
        }
        subject.refreshResult();
    });
    parent.appendChild(input);

    var total = document.createElement("b");
    total.innerHTML = " /";
    total.innerHTML += bolded(remaining);
    parent.appendChild(total);

    return parent;
}
})();