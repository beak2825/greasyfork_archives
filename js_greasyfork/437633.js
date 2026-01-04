// ==UserScript==
// @name        AO3Helper 
// @namespace   Violentmonkey Scripts
// @match       https://archiveofourown.org/*
// @grant       none
// @version     1.02
// @author      SeanZ
// @description Customize Ao3 to avoid certain tags!
// @downloadURL https://update.greasyfork.org/scripts/437633/AO3Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/437633/AO3Helper.meta.js
// ==/UserScript==

// get all works on the page and return an array
function getAllWorks()
{
  'use strict';
  
  return Array.from(document.getElementsByClassName("blurb"))
}

// get an array of tags from a given work
function getWorkTags(work)
{
  'use strict';
  // remember that tags are just links with the class "tag",
  // so we can use our trusty getElementsByClassName, or
  // we can use a querySelector. 
  
  let tagElements = Array.from(work.getElementsByClassName("tag"))
  
  // to make our lives simplier, why don't we just return 
  // the *text* of the tag, instead of the element. The map
  // function can help here - it applies a function to every
  // element of an array and spits out a new array.
  
  return tagElements.map(tagElem => tagElem.text)
}

// get an array of authors for a work
function getWorkAuthors(work) {
  'use strict';
  
  // we're just looking for links with rel=author,
  // as we did earlier, but we'll also apply map on
  // them too.
  
  let authorElements = Array.from(work.querySelectorAll('a[rel=author]'))
  return authorElements.map(authorElem => authorElem.text)
}

// check if two sets of things share a common element
function isAnyElementShared(listA, listB) {
  'use strict';

  // we're going to use the Array.some function we wrote earlier. This just
  // makes it a bit more readable when we start mixing rules in our main 
  // function.
  return listA.some(itemA => listB.includes(itemA))
}

function hideWorks()
{
  'use strict';
  
  const restrictedTags = ["Akaashi%20Keiji*s*Miya%20Osamu", "TagB", "TagC"]
  const restrictedAuthors = ["AuthorA", "AuthorB_Pseud(with username)"]
  
  // use a function to get all the works on the page
  let works = getAllWorks()
  
  // for each work...
  works.forEach(work => {
    
    // use our function getWorkTags to get all tags 
    // with this work
    let tags = getWorkTags(work)
    
    /// and get the authors
    let authors = getWorkAuthors(work)
    
    // use our isAnyElementShared function to check if the work contains
    // any restricted tags OR (the '||' operator) a restricted author
    if (isAnyElementShared(restrictedTags, tags) 
       || isAnyElementShared(restrictedAuthors, authors)) {
      work.style.display = 'none'
    }
    
  })
}

// run the functions!
hideWorks()