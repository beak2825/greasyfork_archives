// ==UserScript==
// @name        4chan thread sorter
// @namespace   Violentmonkey Scripts
// @match       https://boards.4chan.org/*
// @grant       none
// @version     1.0
// @author      Anon
// @description 10/12/2024, 14:57:32
// @downloadURL https://update.greasyfork.org/scripts/520659/4chan%20thread%20sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/520659/4chan%20thread%20sorter.meta.js
// ==/UserScript==


let currentOption = 'default';
const thread = document.querySelector('.thread');
if (!thread) return;


// Post sorter
const postOrderReplies = (post) => {
  const replyCount = post.querySelectorAll('.postInfo .backlink').length;
  post.style.order = 100 - replyCount;
}

const postOrderCatbox = (post) => {
  const postContent = post.querySelector('.postMessage').textContent;
  const matches = postContent.match(/catbox\.moe/g);
  const catboxCount = matches ? matches.length : 0;
  post.style.order = 100 - catboxCount;
}

const assignPostOrder = () => {
  if (currentOption === 'default') {
    thread.style.display = 'block';
    return;
  }

  thread.style.display = 'flex';
  const posts = thread.querySelectorAll('.replyContainer');

  if (currentOption === 'replies') {
    posts.forEach(post => postOrderReplies(post));
  } else if (currentOption === 'catbox') {
    posts.forEach(post => postOrderCatbox(post));
  }
}


// Create option select
const selectOptions = ['Default', 'Replies', 'Catbox'];
const selectElement = document.createElement('select');

selectOptions.forEach(option => {
  const optionElement = document.createElement('option');
  optionElement.value = option.toLowerCase();
  optionElement.textContent = option;
  selectElement.appendChild(optionElement);
});

selectElement.id = 'thread-sort';
document.body.appendChild(selectElement);

selectElement.addEventListener('change', (event) => {
  currentOption = event.target.value;
  assignPostOrder();
});


// Select observer
const observerCallback = (mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      assignPostOrder();
    }
  }
};

const threadObserver = new MutationObserver(observerCallback);
threadObserver.observe(thread, { childList: true, subtree: false });


// Styles
const style = document.createElement('style');
style.innerHTML = `
  .thread {
    flex-direction: column;
  }

  .thread .opContainer {
    order: 1;
  }

  #thread-sort {
    position: fixed;
    top: 2.5rem;
    right: 2rem;
    opacity: 0.5;
    padding: 0.4rem 0.6rem;
    background: white !important;
    border: none !important;
    border-radius: 0.2rem;
    transition: all ease 150ms;
    cursor: pointer;
  }

  #thread-sort:hover {
    opacity: 1;
  }
`;

document.head.appendChild(style);