// ==UserScript==
// @name         NewLayoutForSpecials
// @namespace    SpecialMunzees
// @version      2.0
// @description  New layout for better view with filter
// @author       CzPeet
// @match        https://www.munzee.com/m/*/specials/
// @update       https://greasyfork.org/en/scripts/373789-newlayoutforspecials
// @downloadURL https://update.greasyfork.org/scripts/373789/NewLayoutForSpecials.user.js
// @updateURL https://update.greasyfork.org/scripts/373789/NewLayoutForSpecials.meta.js
// ==/UserScript==

var specials = [];

function autocomplete(inp, arr)
{
    /*the autocomplete function takes two arguments, the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/

    inp.addEventListener("input", function(e)
    {
        var a, b, i, val = this.value;
        var idx = 0;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++)
        {
            /*check if the item contains same letters as the text field value:*/
            idx = arr[i].toUpperCase().indexOf(val.toUpperCase());
            if (idx >=0)
            {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = arr[i];
                //return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
                b.innerHTML = b.innerHTML.slice(0,idx) + "<strong>" + b.innerHTML.slice(idx,idx+val.length) + "</strong>" + b.innerHTML.slice(idx+val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";

                a.appendChild(b);
            }
        }

        updateIcons(val);
    });

    function addActive(x)
    {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x)
    {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++)
        {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt)
    {
        /*close all autocomplete lists in the document, except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++)
        {
            if (elmnt != x[i] && elmnt != inp)
            {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    function updateIcons(textpart)
    {
        var UL_container = document.getElementById("specials-listing");
        var IL_items = UL_container.getElementsByTagName("li");
        for (var i = 0; i < IL_items.length; ++i)
        {
            if (IL_items[i].innerHTML.toUpperCase().indexOf(textpart.toUpperCase()) < 0)
            {
                IL_items[i].setAttribute("style", "display: none");
            }
            else
            {
                IL_items[i].removeAttribute("style");
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e)
    {
        closeAllLists(e.target);
    });
}

function doitnow()
{
    //add inputbox
    $('.page-header').append('<input id="inputBox4Specials" placeholder="Type here (e.g.: flat)" type="text">');

    //collect specials
    var UL_container = document.getElementById("specials-listing");
    var IL_items = UL_container.getElementsByTagName("li");

    for (var sp = 0; sp < IL_items.length; sp++)
    {
        specials.push(IL_items[sp].children[1].children[2].innerText);
    }

    //create new design
    for (var i = 0; i < IL_items.length; ++i)
    {
        //OLD PART
        var oldIL = IL_items[i];
        var spanElement = oldIL.children[0].children[0];
        var imgElement = oldIL.children[1].children[0];
        var brElement = oldIL.children[1].children[1];
        var pElementText = oldIL.children[1].children[2].innerText;
        var href_x = oldIL.children[1].href;

        //NEW PART
        var newIL = document.createElement("li");

        var textElement = document.createTextNode(" - "+pElementText);
        var pElement = document.createElement("p");
        pElement.appendChild(spanElement);
        pElement.appendChild(textElement);

        var aElement = document.createElement("a");
        aElement.href = href_x;
        aElement.appendChild(pElement);

        newIL.appendChild(imgElement);
        newIL.appendChild(brElement);
        newIL.appendChild(aElement);

        //REPLACE
        UL_container.replaceChild(newIL, oldIL);
    }

    //autocomplete
    autocomplete(document.getElementById("inputBox4Specials"), specials);
}

//If page is loaded, we can create elements and collect the specials
doitnow();