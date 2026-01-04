// ==UserScript==
// @name Ceph Github helper
// @description This userscript will add quick action buttons to the Github pull request page
// @namespace com.suse.tmelo.ceph-github-helper
// @version 1.0.0
// @match https://github.com/ceph/ceph/pull/**
// @require https://cdnjs.cloudflare.com/ajax/libs/zepto/1.2.0/zepto.min.js
// @grant       GM_getValue
// @grant       GM_notification
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @connect     githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/370154/Ceph%20Github%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/370154/Ceph%20Github%20helper.meta.js
// ==/UserScript==

let githubmap = JSON.parse(GM_getValue("githubmap", "{}"));
let firstRun = true;

let prepareParticipants = () => {
  let participantsText = "";
  participants.forEach(participant => {
    let user = githubmap[participant];
    if(user) {
      participantsText += `Reviewed-by: ${user.name} <${user.email}>\n`;
    } else {
      participantsText += `Reviewed-by: ${participant} <NOT@FOUND>\n`;
    }
  });

  if (firstRun) {
    firstRun = false;

    $("#partial-discussion-sidebar").append(
      '<div class="discussion-sidebar-item"> \
        <div class="discussion-sidebar-heading text-bold">Ceph Github Helper</div> \
        <button class="btn btn-sm" id="cgh-reviewed"> \
          Reviewed-by \
        </button> \
        <button class="btn btn-sm" id="cgh-retest"> \
          Retest \
        </button> \
      </div>'
    );

    $("#cgh-reviewed").click(() => {
      $("#new_comment_field").val(participantsText);
    });

    $("#cgh-retest").click(() => {
      $("#new_comment_field").val("jenkins retest this please");
    });
  }
};

let refreshGithubmap = () => {
  githubmap = {};
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://raw.githubusercontent.com/ceph/ceph/master/.githubmap",
    onload: responseDetails => {
      let raw = responseDetails.responseText
        .split("\n")
        .filter(line => line.indexOf("#") == -1 && line.length > 0)
        .forEach(line => {
          var found = line.match(/(\w*?) (.*?) <(.*?)>/);

          githubmap[found[1]] = {
            user: found[1],
            name: found[2],
            email: found[3]
          };
        });

      GM_setValue("githubmap", JSON.stringify(githubmap));
      GM_notification(".githubmap updated", "Ceph Github Helper")
      prepareParticipants();
    }
  });
};

GM_registerMenuCommand("Get .githubmap", refreshGithubmap);

// Get author
const author = $(".head-ref span.user").text();

// Get participants
const participants = [];
$(".participation img").each((index, element) => {
  const participant = $(element)
    .attr("alt")
    .replace("@", "");
  if (participant != author) {
    participants.push(participant);
  }
});

if (!githubmap) {
  refreshGithubmap();
} else {
  prepareParticipants();
}
