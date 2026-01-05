/*
 *  name         Get Blocked Users
 *  namespace    pxgamer
 *  version      0.6.1
 *  description  Get a list of your blocked users.
 *  author       pxgamer
 */

function gbu() {
    'use strict';

    let returnedData;
    let searchString = /<span class="aclColor_.*"><a class="plain" href="\/user\/.*\/">([a-z0-9 _.-]+)<\/a>/gi, matches, blockedUsers = [];

    $.ajax({
        type: "GET",
        url: "/settings/privacy/",
        async: false,
        success: function (data) {
            returnedData = data;
            while (matches = searchString.exec(returnedData.html)) {
                blockedUsers.push(matches[1]);
            }
            console.log(blockedUsers);
        },
        returnData: "json"
    });
	return blockedUsers;
}
