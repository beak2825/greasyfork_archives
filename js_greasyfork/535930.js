// ==UserScript==
// @name        Discourse Reactions mobile hotfix
// @match       *://www.uscardforum.com/*
// @description Fixes reaction rendering in mobile view
// @version 0.0.1.20250514025250
// @namespace https://greasyfork.org/users/1386876
// @downloadURL https://update.greasyfork.org/scripts/535930/Discourse%20Reactions%20mobile%20hotfix.user.js
// @updateURL https://update.greasyfork.org/scripts/535930/Discourse%20Reactions%20mobile%20hotfix.meta.js
// ==/UserScript==

(function() {
  const Site = require("discourse/models/site").default;
  const currentSite = Site.current();

  if (!currentSite.mobileView) {
    console.log("Not applying discourse-reactions hotfix - Not mobile");
    return;
  }

  const ReactionsActionSummary = require("discourse/plugins/discourse-reactions/discourse/components/discourse-reactions-actions-summary").default;
  ReactionsActionSummary.shouldRender = (args, context, owner) => {
    // ¯\_(ツ)_/¯
    const siteSettings = owner.lookup("service:site-settings");
    const mainReaction = siteSettings.discourse_reactions_reaction_for_like;
    return (
      args.post.user_id === Discourse.User.current().id &&
      args.post.reactions &&
      (args.post.reactions.length && !args.post.reactions.some(r => r.id === mainReaction))
    );
  };

  const appEvents = Discourse.lookup("service:app-events");
  appEvents.trigger("post-stream:refresh", { force: true });
  console.log("Applied discourse-reactions hotfix");
})()