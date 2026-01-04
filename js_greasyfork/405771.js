// ==UserScript==
// @name         Sort Soundgasm Posts
// @version      1
// @description  Allows you to sort soundgasm.net posts by play count
// @author       Oniisama
// @match        *soundgasm.net/u/*
// @namespace https://greasyfork.org/users/616912
// @downloadURL https://update.greasyfork.org/scripts/405771/Sort%20Soundgasm%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/405771/Sort%20Soundgasm%20Posts.meta.js
// ==/UserScript==

// Get all posts on the page as a NodeList, then transform into Array
let container = document.getElementsByTagName("body")[0];
let posts = document.getElementsByClassName("sound-details");
posts = Array.prototype.slice.call(posts, 0);

let sorting_array = [];
let default_post_array = [];

// Add posts and their respective playcount to sorting_array
posts.forEach(function(post){
    let playcount = post.getElementsByClassName("playCount")[0].textContent.slice(12);

    // [0] = playcount number (1 * string = number)
    // [1] = the element itself
    sorting_array.push([1 * playcount, post]);
});

// Keep a copy of this array so the page can be restored to default
default_post_array = Array.from(sorting_array);

function SortPage (sorting_array){
    // Sort the elements on the page itself
    for (let i=0; i<sorting_array.length; i++)
    {
        // sorting_array[ID][ELEMENT]
        container.appendChild(sorting_array[i][1]);
    }
}

function SortPostsDescending(sorting_array)
{
    // I don't really get the function parameter but it works ig
    sorting_array.sort(function(x, y) {
        return y[0] - x[0];
    });

    SortPage(sorting_array);
}

function SortPostsAscending(sorting_array)
{
    // I don't really get the function parameter but it works ig
    sorting_array.sort(function(x, y) {
        return x[0] - y[0];
    });

    SortPage(sorting_array);
}

function SortPostsDefault(default_post_array)
{
    SortPage(default_post_array);
}

function CreateButton(text, func)
{
    let btn = document.createElement("button");
    btn.innerHTML = text;
    btn.style.margin = "10px 5px 5px 0";
    btn.onclick = func;

    return btn;
}

// Create buttons
let insertion_location = document.getElementsByClassName("sound-details")[0];
container.insertBefore(CreateButton("Sort By Play Count (Desc)", function(){SortPostsDescending(sorting_array)}), insertion_location);
container.insertBefore(CreateButton("Sort By Play Count (Asc)", function(){SortPostsAscending(sorting_array)}), insertion_location);
container.insertBefore(CreateButton("Reset to Default", function(){SortPostsDefault(default_post_array)}), insertion_location);