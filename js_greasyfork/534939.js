// ==UserScript==
// @name         绳网跨域助手
// @namespace    http://tampermonkey.net/
// @version      1.7.1
// @description  none
// @author       claxmo
// @license      MIT
// @run-at       document-start
// @match        http://localhost:*/inter-knot/*
// @match        https://claxmo.github.io/inter-knot/*
// @connect      github.com
// @connect      api.github.com
// @connect      private-user-images.githubusercontent.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/534939/%E7%BB%B3%E7%BD%91%E8%B7%A8%E5%9F%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/534939/%E7%BB%B3%E7%BD%91%E8%B7%A8%E5%9F%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const CLIENT_ID = "Ov23lifQzV3VA2p4vEmL";
    const CLIENT_SECRET = "b9cab7872c74d1958582676e4393bc112cacee24";
    const OWNER = "claxmo";
    const REPO = "inter-knot";
     const TIMEOUT = 5000;
    let accessToken = localStorage.getItem('access_token');
    unsafeWindow.version = "1.7.1";

    const request = async (method, url, data = null, timeout = TIMEOUT) => {
         return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Accept": "application/json"
                },
                ...(data && { data: JSON.stringify(data) }),
                timeout,
                onload: (res) => {
                    if (res.status === 401){
                        localStorage.removeItem("access_token");
                        accessToken = null;
                        return authLogin();
                    }else{
                        resolve(JSON.parse(res.responseText));
                    }
                },
                ontimeout: () => reject(new Error('request timeout')),
                onerror: () => reject(new Error('request error'))
            });
        });
    };

    const getAccessToken = async (code, timeout = TIMEOUT) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://github.com/login/oauth/access_token",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                data: JSON.stringify({
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    code,
                }),
                timeout,
                onload: (res) => {
                    resolve(JSON.parse(res.responseText).access_token);
                },
                onerror: () => reject(new Error('get access_token error')),
                ontimeout: () => reject(new Error ('get access_token timeout')),
            });
        });
    };

    const authLogin = () => {
        window.location.href =`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=public_repo`;
    };

    const graphql = async (query, variables) => {
        return await request("POST","https://api.github.com/graphql",{query,variables});
    };

    unsafeWindow.getBlob = async (url) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                onload: (res) => {
                    resolve(res.response);
                },
                onerror: () => reject(new Error('get blob error: ' + url)),
            });
        });
    };

    unsafeWindow.getUserProfile = async () => {
        return await request("GET","https://api.github.com/user");
    };

    unsafeWindow.searchDiscussion = async (query = '', cursor = null) => {
        return (await graphql(
          `query($query: String!, $cursor: String ) { search(type: DISCUSSION, query: $query, first: 20, after: $cursor ) { pageInfo { endCursor hasNextPage } nodes { ... on Discussion { id number title body bodyHTML bodyText author { login avatarUrl } category { id name emoji } createdAt updatedAt url comments { totalCount } locked viewerCanDelete viewerDidAuthor reactionGroups { content viewerHasReacted users { totalCount } } reactions { totalCount } upvoteCount } } } }`,
          { query: `repo:${OWNER}/${REPO} ${query}`.trim(), cursor }
        )
      ).data.search;
    };

    unsafeWindow.getDiscussionComments = async (discussionId, cursor = null, isAsc = true) => {
        return (await graphql(
          `query($id: ID!, $cursor: String) { node(id: $id) { ... on Discussion { comments(${isAsc ? 'first' : 'last'}: 20, ${isAsc ? 'after' : 'before'}: $cursor) { pageInfo { startCursor hasPreviousPage, endCursor, hasNextPage } totalCount nodes { author { login avatarUrl } authorAssociation body bodyHTML bodyText createdAt id updatedAt url viewerCanDelete viewerDidAuthor reactionGroups { content viewerHasReacted users { totalCount } } reactions { totalCount } upvoteCount } } } } }`,
          { id: discussionId, cursor }
        )
      ).data.node.comments;
    };

    unsafeWindow.deleteDiscussion = async (discussionId) => {
        return (await graphql(
            `mutation($discussionId: ID!) { deleteDiscussion(input: { id: $discussionId } ) { clientMutationId } }`,
            { discussionId }
        )
      ).data.deleteDiscussion;
    };

    unsafeWindow.deleteDiscussionComment = async (commentId) => {
        return (await graphql(
            `mutation($commentId: ID!) { deleteDiscussionComment(input: { id: $commentId } ) { clientMutationId } }`,
            { commentId }
        )
      ).data.deleteDiscussionComment;
    };

    unsafeWindow.addDiscussionComment = async (discussionId, body) => {
        return (await graphql(
            `mutation($discussionId: ID!, $body: String!) { addDiscussionComment(input: {discussionId: $discussionId, body: $body}) { comment { author { login avatarUrl } authorAssociation body bodyHTML bodyText createdAt id updatedAt url viewerCanDelete viewerDidAuthor } } } }`,
            { discussionId, body }
        )
      ).data.addDiscussionComment.comment;
    };

    unsafeWindow.getDiscussion = async (number) => {
        return (await graphql(
            `query getDiscussion($number: Int!) { repository(owner: "${OWNER}", name: "${REPO}") { discussion(number: $number ) { id number title body bodyHTML bodyText author { login avatarUrl } category { id name emoji } createdAt updatedAt url comments { totalCount } locked viewerCanDelete viewerDidAuthor reactionGroups { content viewerHasReacted users { totalCount } } reactions { totalCount } upvoteCount } } }`,
            { number }
        )
      ).data.repository.discussion;
    };

    unsafeWindow.addReaction = async (subjectId, content) => {
        return (await graphql(
            `mutation($subjectId: ID!, $content: ReactionContent!) { addReaction(input: {subjectId: $subjectId, content: $content}) {reaction { content } subject { id } } }`,
            { subjectId, content }
        )
      ).data.addReaction.reaction;
    };

    unsafeWindow.removeReaction = async (subjectId, content) => {
        return (await graphql(
            `mutation($subjectId: ID!, $content: ReactionContent!) { removeReaction(input: {subjectId: $subjectId, content: $content}) {reaction { content } subject { id } } }`,
            { subjectId, content }
        )
      ).data.removeReaction.reaction;
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
        history.replaceState(null, '', window.location.origin + window.location.pathname);
        getAccessToken(code).then((token) => {
            accessToken = token;
            localStorage.setItem('access_token', accessToken);
            // console.log("Access Token：",accessToken);
        });
    }else if(!accessToken){
        authLogin();
    }
})();
