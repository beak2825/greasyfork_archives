// ==UserScript==
// @name        Remove TweetDeck Retweet Modal Dialog
// @description Skips the "Retweet to your followers?" modal asking whether or not to quote tweet for TweetDeck
// @namespace   https://github.com/alexwh
// @version     1.0
// @match       https://tweetdeck.twitter.com/*
// @downloadURL https://update.greasyfork.org/scripts/406229/Remove%20TweetDeck%20Retweet%20Modal%20Dialog.user.js
// @updateURL https://update.greasyfork.org/scripts/406229/Remove%20TweetDeck%20Retweet%20Modal%20Dialog.meta.js
// ==/UserScript==

function patch() {
    // monkeypatch the displayTweet function that's called near the end of
    // initing the ActionDialog object. we need to call selectAccount first
    // since that's done after the displayTweet call, and we can't really
    // cleanly patch anything later. the original code calls, in order:
    // this.displayTweet(t)
    // this.accountSelector.$node.on(TD.components.AccountSelector.CHANGE, this._handleAccountSelectionChange.bind(this))
    // this.accountSelector.selectAccount(t.account)
    // this.setAndShowContainer((0, s.default) ('#actions-modal'))
    unsafeWindow.TD.components.ActionDialog.prototype.displayTweet = function(t) {
        this.accountSelector.selectAccount(t.account)
        this._retweet()
    }

    // patch setAndShowContainer to not show if we're being called from the
    // retweet ActionDialog. two places call with the #actions-modal selector,
    // retweets, and lists. to not remove lists, check for the presence of the
    // this.$retweetButton variable also. the rest of the function after the
    // first line remains unchanged from the original
    unsafeWindow.TD.components.BaseModal.prototype.setAndShowContainer = function(e, t) {
        if (e.selector === "#actions-modal" && typeof this.$retweetButton !== 'undefined') { return; }
        'boolean' != typeof t && (t = !0),
            t && e.empty(),
            e.append(this.$node).show(),
            this._checkIfTouchModal(e)
    }
}

(function wait() {
    if (unsafeWindow.TD && unsafeWindow.TD.ready) {
        patch();
    } else {
        setTimeout(wait, 1000);
    }
})();

// monologue below about my inexperience with js and userscripts, fumbling
// around to try and get a good solution for this disgustingly easy problem

// this method ended up being the cleanest overall, as we maintain
// tweetdeck's built in error handling, and don't need to reimplement a lot
// of stuff.

// originally, I wanted to monkeypatch the
// `TD.services.TwitterStatus.prototype.retweet` function to not create the
// `TD.components.ActionDialog` object in the first place, and instead just
// trigger the `uiRetweet` event directly which is later done by
// `TD.components.ActionDialog`'s `_retweet` method.
// this wasn't possible because jQuery listeners can't receive extra event
// info from regular javascript event senders (which we need to send the
// `tweetId` and `from` parameters). we also can't import jQuery in the
// userscript and use $(document).trigger as they're namespaced separately
// and the original tweetdeck jQuery instance never receives the event.

// after, I tried reimplementing the `sendRetweet` function that gets
// called by the `uiRetweet` event in
// `TD.services.TwitterStatus.prototype.retweet`. this also led to
// reimplementing `makeTwitterApiCall` and
// `TD.services.TwitterClient.prototype.makeTwitterCall`, and ended up
// becoming too unwieldly when I had to delve into using tweetdeck's async
// deferring techniques for undoing retweets (you need to search the
// original tweet with the `include_my_retweet` parameter, then call
// destroy on that id).

// there was also an attempt at creating a custom ActionDialog object that
// would skip itself, but that didn't get very far either.

// the unfinished code for all is included below, in order:

// function custom_rt() {
//     let acct = TD.storage.accountController.getPostingAccounts()[0].privateState.key
//     let edetail = { id: "xxxx", from: [acct] }
//     let rtev = new CustomEvent('uiRetweet', edetail);
//     document.dispatchEvent(rtev)
// }

// TD.services.TwitterStatus.prototype.retweet = function () {
//     if (!this.isRetweeted) {
//         // uiRetweet(id: this.id, from:this.account.getKey())
//         let url = TD.services.TwitterClient.prototype.API_BASE_URL + "statuses/retweet/:id.json".replace(':id', this.id)
//         params = {method: "POST",
//             handleSuccess: false,
//             handleError: false,
//             url: url,
//             account: this.account
//         }
//         TD.net.ajax.request(url, params)
//         this.setRetweeted(true)
//     }
//     else {
//         // uiUndoRetweet(tweetId: this.getMainTweet().id, from: this.account.getKey())
//         let search_url = TD.services.TwitterClient.prototype.API_BASE_URL + "statuses/show/:id.json?include_my_retweet=true".replace(':id', this.id)
//         let params = {method: "GET", include_my_retweet: true}
//         let search_resp = TD.net.ajax.request(search_url, params)
//         console.log(search_resp)
//         let rt_id = search_resp.results[0].data.current_user_retweet.id_str
//         // let rt_id = search_resp.results[0].data.retweeted_status.id_str
//         // var cb = new TD.core.defer.Deferred

//         let del_url = TD.services.TwitterClient.prototype.API_BASE_URL + "statuses/destroy/:id.json".replace(':id', rt_id)
//         params = {method: "POST",
//             handleSuccess: false,
//             handleError: false,
//             url: del_url,
//             account: this.account
//         }
//         TD.net.ajax.request(del_url, params)
//         this.setRetweeted(false)
//     }
// }

// var ad = new TD.components.ActionDialog({tweet: {tweet: {id: "xxx"}, accountSelector: new TD.components.AccountSelector, getMainUser: function() {return "yes"}},title: "yes"})
