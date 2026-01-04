// ==UserScript==
// @name GGn EZ Collection Management
// @namespace seriouslywhatgoeshere
// @version 1.0
// @description GGn Collection Management Script
// @include https://gazellegames.net/collections.php?action=manage&collageid=*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/372437/GGn%20EZ%20Collection%20Management.user.js
// @updateURL https://update.greasyfork.org/scripts/372437/GGn%20EZ%20Collection%20Management.meta.js
// ==/UserScript==
var collageTable = document.getElementById("manage_collage_table");
var collageHead = collageTable.children[0].children[0]; //actually the first tr in thead
var collageBody = collageTable.children[1]


var thNewSort = document.createElement("th")
thNewSort.innerHTML = "New Sort"
collageHead.append(thNewSort)
var thInsert = document.createElement("th")
thInsert.innerHTML = "Insert"
collageHead.append(thInsert)

for(i = 1; i < collageBody.children.length - 1; i++){
	var td1 = document.createElement("td")
	var td2 = document.createElement("td")
	var nsInput = document.createElement("input")
	nsInput.type = "text"
	nsInput.class = "sort-numbers"
	nsInput.size = 4
	var insertBtn = document.createElement("input")
	insertBtn.value = "Insert"
	insertBtn.type = "button"
	insertBtn.style= "margin:3px 3px !important"
	insertBtn.id = "Insert"+i
	insertBtn.addEventListener("click", function(){
		var oldSort = Number(this.parentElement.parentElement.children[0].children[0].value)
		var newSort = Number(this.parentElement.parentElement.children[6].children[0].value)
		for(i = 1; i < collageBody.children.length - 1; i++){
			if(i != this.parentElement.parentElement.rowIndex - 1){
				curSort = Number(collageBody.children[i].children[0].children[0].value);
				if(newSort <= curSort && curSort < oldSort){
					collageBody.children[i].children[0].children[0].value = Number(collageBody.children[i].children[0].children[0].value) + 10
				}else if(newSort >= curSort && curSort > oldSort){
					collageBody.children[i].children[0].children[0].value = Number(collageBody.children[i].children[0].children[0].value) - 10
				}
			}
		}
		this.parentElement.parentElement.children[0].children[0].value = newSort
	})
	td1.append(nsInput)
	td2.append(insertBtn)
	collageBody.children[i].append(td1)
	collageBody.children[i].append(td2)
}