// ==UserScript==
// @name         LibReddit Redirector
// @namespace    https://violentmonkey.github.io/
// @version      1.5
// @description  Automatically redirects all links from Reddit to Libreddit
// @author       Streampunk
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAMAAAAKE/YAAAAA5FBMVEUfHx////8B//8jHSM7Ozvp6ekiIiIALzAfHyEaGhohHiFhYWGcnJwMpKUd9fUL//4fIB0V9/Q41M0ATEQFKCN0dHQTJSUlmZukpKQcIR8f1dUCSEkWIiIHJyUfIBsAUlAyv78j7vUALDInlp4fICccIx8AMiwmHCEf1NcDR0sYICQjHxkhIRUpHBcfIxtCQkIAIS8yMjInaWkzfIgMOkYZLTI56+od6/VLys0QqqQA9/4Nppki9ekJ//YW4OVBuLQNSVIKJTIkJC8ASVQogX88ur9Kn5sQIx8APDwAQUELHyTLy8tHGpacAAADIUlEQVR4nO3cf1PaMBzH8Qw0pJmWgFqptHUixVJ/zjmnbk4252Ts+T+fJVh3gEJpNbT1Pu9/vOtx+rrvRdpyDYQghBBCCCGEEEIIIYTQXDFZ1obE5QItRLLX54Cs0I5jzV0YhgswGfTZ5PFHtG21WpWWrCKLfkyrdXISEkZsW6uZko8rjedaaWw8mIV1uru5+9jm7HY/nX22GddKVujj5XfP13gwk9bq+c6XnShzducXTdfhZa6XPQe6clkrXalK8Zn17fVQorWaJXppGnpl+ALb73z9dl2dAxyh3bDNdK9pGoP27xX6OhlaK3ketDOc9MioqzOqSTRjfG8vW7SdDL217RoKrXVVx6EZ8TuXtbElHTtpwsplneZYtHzzqqya8/4flszhpDNGc/nnE6MJKRi6XkR0kA80S45mms+JQAMN9NtFc60Xeq+NlmdEoU7+hUPbRPNdoga04RcMra6n1X1lrtGTN7tmfc1lwtN9N54aXa2a378HQbA1WnDTHHDh5XbS8tbqtNfrNkfrdnuDNhdRuUQHvR8/Q2e0MAzb8rySX3TJvLiVaHs8om4rhedpJL9o0mZwOyg/TjXK8zz1W/f384tuupM27+BAHTk81Eh+2fLY2l73JtAi7+hafW39ySLQuix0oRcS0EADDTTQQAMNNNBAAw000EADDTTQQAMNNNBAAw000EADDXRyNAca6CloUkg0LyKacLXh7OnOsqsr8zyvaOF5xP11d3f3YSJ55OZ35z6vaGF1+v2zPxN1z/r9/r2/kGdSEqKHT1JRyxoMrIE7ltqaKs16nwpLix6qKTVYKBt9kI1zQQQxcjjp4fo48o6OPNZut9lIttq2zDPabR2LFpIsU+j/akrVNkn1PHo26tjlIUft+77NImLEpI4jD+jeAJweLYRaxRMzjdDZvHnMQjeMNBGDjO0/XzD670aa6Pju+UWjU7W8lO2k06GPSREnTYEG+o2htTCBBhpooIEGGmiggQY6BVrPNfQYevoXoqVDHxv60Ybx+h8h6I/S968aXQSa0FSffs34VAwhhBBCCCGEEEIIIYQQKkT/AMjqwT28TZzjAAAAAElFTkSuQmCC
// @match        https://www.reddit.com/*
// @match        https://new.reddit.com/*
// @match        https://old.reddit.com/*
// @match        https://reddit.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478548/LibReddit%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/478548/LibReddit%20Redirector.meta.js
// ==/UserScript==

(function () {
	 'use strict';
// You can set alternative private front-end that works better for you such as libreddit.eu.org, libreddit.freedit.eu or libreddit.mha.fi.
	 //top.location.hostname = "optiplex:8011”

// By default userscript uses Farside provides links that automatically redirect to working instances of Libreddit
	 window.location.assign((window.location.href.split("?")[0]).replace("https://www.reddit.com", "http://optiplex:8011").replace("https://new.reddit.com", "http://optiplex:8011").replace("https://old.reddit.com", "http://optiplex:8011").replace("https://reddit.com", "http://optiplex:8011"))
})();