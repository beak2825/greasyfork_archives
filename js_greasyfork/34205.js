// ==UserScript==
// @name         Planning board
// @version      0.6
// @description  Filter issues by tag and by user.
// @author       Maurice Gohlke
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @match        https://github.int.bosppaa.com/orgs/deepfield/projects/1
// @namespace    https://github.int.bosppaa.com/orgs/deepfield/projects/1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34205/Planning%20board.user.js
// @updateURL https://update.greasyfork.org/scripts/34205/Planning%20board.meta.js
// ==/UserScript==

(function() {
    $().ready(() => setTimeout(() => {
        var $refButton = $(".d-table").find(".d-table-cell").eq(1)

        // Any button that we want to add
        var $newButton = $refButton.clone()
        $newButton.find("svg").attr("class", "")

        var userName = $(".name").find("img.avatar").attr("alt").split("@")[1]
        console.log(userName)

        var selectedUser = ""
        var selectedTag = ""

        var toggleUserView = () => {

            // Get cards that should be shown because they are assigned to the user or they were created by the user
            var $shownCards = (selectedUser !== "")
                ? $(".project-card").has(`img.avatar[alt='@${selectedUser}']`)
                : $(".project-card")

            // Restrict the set of shown cards to those that have the selected tag (if there is a selected tag)
            if (selectedTag !== "") {
                $shownCards = $shownCards.has(`.issue-card-label:contains(${selectedTag})`)
            }

            // Hide all cards and show the selected ones (user + tags)
            $(".project-card").hide()
            $shownCards.show()

            // Show the show all tags button
            $(".btn-link[tag=true]").html(`Clear '${selectedTag}' filter`)
            if (selectedTag !== "") $(".btn-link[tag=true]").show()
            else $(".btn-link[tag=true]").hide()

            if (selectedUser === "") {
                $filterByUser.find(".btn-link").html(userName)
                $filterByUser.off("click").on("click", (e) => {e.stopPropagation(); selectedUser = userName; toggleUserView()})
            }
            else {
                $filterByUser.find(".btn-link").html(`all users (remove filter for '${selectedUser}')`)
                $filterByUser.off("click").on("click", (e) => {e.stopPropagation(); selectedUser = ""; toggleUserView()})
            }

            // make all avatars clickable to select user
            $("img.avatar").off("click").css("cursor", "pointer").on("click", (e) => {e.stopPropagation(); selectedUser = $(e.target).attr("alt").split("@").pop(); toggleUserView()})

            // Make all tag labels "selectable"
            setTimeout(() => {
                $(".issue-card-label").css({cursor: "pointer"})
                $(".issue-card-label").off('click').on("click", (e) => {
                    e.stopPropagation()
                    selectedTag = $(e.target).html()
                    toggleUserView()
                })
            }, 100)
        }

        var $filterByUser = $newButton.clone()
        $filterByUser.insertAfter($refButton)

        var $filterByTag = $newButton.clone()
        $filterByTag.find(".btn-link").html("all tags").attr("tag", "true")
        $filterByTag.on("click", (e) => {e.stopPropagation(); selectedTag = ""; $filterByTag.show(); toggleUserView()})
        $filterByTag.insertAfter($refButton)

        toggleUserView()
    }, 200))
})();

