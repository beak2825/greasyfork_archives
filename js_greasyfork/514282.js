// ==UserScript==
// @name        Always Filterable
// @description Always enable the "filter by user" option
// @match       *://www.uscardforum.com/*
// @namespace   mr06cpp
// @version     1.4
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/514282/Always%20Filterable.user.js
// @updateURL https://update.greasyfork.org/scripts/514282/Always%20Filterable.meta.js
// ==/UserScript==

(function() {
  const init = () => {
    console.log("Initializing Always Filterable plugin");

    const I18n = require("discourse-i18n").default;
    const UserCardContents = require("discourse/components/user-card-contents").default;

    UserCardContents.reopen({
      get filterPostsLabel() {
        if (!this.get("topicPostCount")) {
          return "话题中的帖子";
        }

        return I18n.t("topic.filter_to", {
          username: this.get("username"),
          count: this.get("topicPostCount"),
        });
      },
      enoughPostsForFiltering: true,
    });
    _ = new UserCardContents();
  };

  init();
})();