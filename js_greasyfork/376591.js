// ==UserScript== 
// @name hideThinker
// @namespace deepThinker 
// @description Hide users in Kluv 
// @include https://thecage.co.il/*
// @require http://code.jquery.com/jquery-3.3.1.js
// @version 0.0.5
// @downloadURL https://update.greasyfork.org/scripts/376591/hideThinker.user.js
// @updateURL https://update.greasyfork.org/scripts/376591/hideThinker.meta.js
// ==/UserScript==

let hiddenUsers = window.hiddenUsers;
$(document).ready(() => {
    hiddenUsers = getHiddenUsersList() || [];
    // Only if within profile page 
    window.location.href.includes('profile') && initHideUserButton();
    hiddenUsers.forEach(user => {
        // Blog in front page 
        $(`.frontpage_box_small_item:contains(${user})`).hide();
        // Comment
        $(`article:contains(${user})`).hide();
        // User in usersList 
        $(`td span.user:contains(${user})`).hide();
    });
});

toggleUser = () => {
    const selectedUser = $('.profile-username > span').text();
    if (hiddenUsers.includes(selectedUser)) {
        hiddenUsers = hiddenUsers.filter(user => user !== selectedUser);
    } else {
        hiddenUsers.push(selectedUser);
    }
    localStorage.setItem('hiddenUsers', JSON.stringify(hiddenUsers));
    initHideUserButton();
}

getHiddenUsersList = () => {
    const users = localStorage.getItem('hiddenUsers');
    if (users) {
        return JSON.parse(users);
    } else {
        localStorage.setItem('hiddenUsers', JSON.stringify([]));
    }
}

initHideUserButton = () => {
    // Remove the btn if any before drawing 
    $('.hideUserBtn').remove();
    const username = $('.profile-username > span').text();
    const btnText = hiddenUsers.includes(username) ? 'הצג יוזר' : 'הסתר יוזר';
    $('.profileActionButtons').append(`
        <div class="col-md-3 col-sm-6 profileActionButtonsColumn hideUserBtn">
            <button class="btn btn-info btn-block" role="button" onClick="toggleUser()">
            <i class="icon-block" aria-hidden="true"></i>
            <span>&nbsp;</span>  
            ${btnText}
            </button>
        </div>
     `);
}