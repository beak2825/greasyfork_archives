// ==UserScript==
// @name        Trump Desk
// @version     1.0
// @author      i vomit kittens
// @description Embeds posts from the desk of President Donald J. Trumo into the Something Awful Dot Com Forums.
// @include     http*://forums.somethingawful.com/*
// @grant       GM.xmlHttpRequest
// @run-at      document-idle
// @namespace https://greasyfork.org/users/768882
// @downloadURL https://update.greasyfork.org/scripts/426017/Trump%20Desk.user.js
// @updateURL https://update.greasyfork.org/scripts/426017/Trump%20Desk.meta.js
// ==/UserScript==


const trumps = ['TRUMP', 'TRUMJ', 'TRUMO', 'TRNMP', 'TUP', 'TREMP', 'TREMB', 'TRMPY', 'TRNNG'];

const url_pattern = /https:\/\/www.donaldjtrump.com\/desk\/desk-[^\/]*\//g;
const parser = new DOMParser();

async function createEmbedFromUrl(url, postDiv) {
    GM.xmlHttpRequest({
        method: 'GET',
        url: url,
        onload: function(response) {
            const html = response.responseText;
            const trumpPage = parser.parseFromString(html, 'text/html');
            const contentDiv = trumpPage.querySelector('.ftdli-main-content');
            const postImage = contentDiv.querySelector('img');
            const post = trumpPage.querySelector('.ftd-post-text');
            const postDate = trumpPage.querySelector('.date.ftd-d > p').innerHTML;
            const embedContainer = document.createElement('div');
            embedContainer.classList.add('trumpDeskEmbed');
            embedContainer.setAttribute('style', `
            max-width: 550px;
            width: 100%;
            margin: 10px 0;
            border: 1px solid #304867;
            border-radius: 5px;
            background-color: white;
            padding: 10px;
            `)

            const embedSubtitle = document.createElement('div');
            embedSubtitle.classList.add('embedSubtitle');
            embedSubtitle.innerText = 'FROM THE DESK OF'
            embedSubtitle.setAttribute('style', `
            color: #213875;
            text-align: center;
            letter-spacing: 0.5em;
            font-size: 20px;
            font-weight: bold;
            `)
            embedContainer.appendChild(embedSubtitle);

            const embedTrumpName = document.createElement('div');
            embedTrumpName.classList.add('embedTrumpName');
            const randTrump = trumps[Math.floor(Math.random() * trumps.length)]
            embedTrumpName.innerText = `DONALD J. ${randTrump}`;
            embedTrumpName.setAttribute('style', `
            color: #213875;
            text-align: center;
            font-size: 40px;
            font-weight: bold;
            margin: 15px 0;
            `)
            embedContainer.appendChild(embedTrumpName);

            const embedPostDate = document.createElement('div')
            embedPostDate.classList.add('embedPostDate');
            embedPostDate.innerText = `- ` + postDate + ' -'
            embedPostDate.setAttribute('style', `
            text-align: center;
            color: #a0a0a0;
            margin-bottom: 25px;
            `)
            embedContainer.appendChild(embedPostDate);

            if(postImage) {
                const embedPostImage = document.createElement('img');
                embedPostImage.classList.add('embedPostImage');
                embedPostImage.setAttribute('src', postImage.getAttribute('src'));
                embedPostImage.setAttribute('style', `
                max-width: 100%;
                border-radius: 5px;
                `);
                embedContainer.appendChild(embedPostImage);
            }

            const embedPostText = document.createElement('div')
            embedPostText.classList.add('embedPostText');
            embedPostText.innerHTML = post.innerHTML;
            if(embedPostText.innerHTML === '' && !postImage) {
                embedPostText.innerHTML = 'THIS POST CONTAINS SOME STUPID SHIT I WAS TOO LAZY TO FIGURE OUT LIKE A VIDEO OR SOMETHING, JUST CLICK THIS EMBED TO GO TO THE POST.';
            }
            embedPostText.setAttribute('style', `
            color: #202020;
            font-size: 16px;
            line-height: 24px;
            `)
            embedContainer.appendChild(embedPostText);

            const link = postDiv.querySelector(`a[href='${url}']`);
            link.style.textDecoration = 'none';
            link.style.color = 'inherit';
            link.innerHTML = '';
            link.appendChild(embedContainer);
        }
    })
}

const posts = Array.from(document.getElementsByClassName('postbody'));
posts.forEach(post => {
    const urlsInPost = post.innerText.match(url_pattern) || []
    urlsInPost.forEach(url => {
        createEmbedFromUrl(url, post);
    });
})
