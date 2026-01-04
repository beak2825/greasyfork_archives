// ==UserScript==
// @name         ACL Anthology: create an issue on GitHub
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Provide a button to create new issue on GitHub
// @author       Tosho Hirasawa
// @match        https://www.aclweb.org/anthology/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408580/ACL%20Anthology%3A%20create%20an%20issue%20on%20GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/408580/ACL%20Anthology%3A%20create%20an%20issue%20on%20GitHub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var gh_username = 'toshohirasawa';
    var gh_reponame = 'literatures';
    var gh_favicon_data =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAm' +
        'pwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANTSURBVHgBvVeNTdtAFH7vbCilUptuYFQihUhNzQQJEzSZ' +
        'oGSChgkIEwATNJ0AmICM4ISKWCKoHiGtVDUCn1/v2cRx4nNIcNRPgpzvnd/fvT8jLAnLsgrGVqEOQlaR0AYECwgKIRF' +
        'hpNYeITkQYFeOf195njdahi8+K7hUsgzcaCPi51jgElDKdGTweOK5rgcvUYAtNl+/PVbLFuSBoDP/j3Hiec5oaQUiqz' +
        'evFdGCNYAAPEkPBzpviPmNYrlsr1M4g3kxz2KxbGtoU6zb8nnoPBF7IIzyOeH8gvp/Gf2uCJUZRNRRK2e6FXnCsuxCS' +
        'gEOuJTlBO3h4KZxP+jvKGbNWBFOu5AxdeO/aO9JMBwOb/vv792bJlBwNKsXWOYbeZx4jlxv4ubPlBG+2L+7c2ILLFtp' +
        'Ph4XslLLKtkWjGGUjHjeMzFI8fbpYYf5mPzAea5j+GjATOp4Tsg4s8B4ruPBkjDEBnuhKdgqBPyiPQSyBjlhZgS0qqZ' +
        '1jgVhjGVddyCMWDC6kBP+FjgZQaxKu6wLFQU10GvQXsWlWeBrQwqaeqqoClXjP+lIciyuYE0Yuj+mWZIACrI5Da15Ar' +
        'ssq3bngAdpQZZYpcPlApHOoIKA/wVEraFCezdhZbbX6xkCW7M7Yg94uvPGtqzCmrBbsmtaAoInKICelkY5B5EECOWhd' +
        'j9AR0TNRKtCbXevkluJ4l7la1alZdlCbhmXujh4wuluuXIMOYSrlD7LonOtCbvhh71KRy0iLQlOwukW8HTSnrkuKFed' +
        'EYne0HW6sEho0bbBDKqEcJgReJEYws6922s+teNpywzrtqQjuW10zYfgOs0EL4eDXkPHdLf88UJdeB2WgE9ih0t9WAd' +
        '4oQSfh+yVPmjgN+77fiAaqUZC8jyTa0DZtCQLJWvSZ+JCJF+JdkIYj2ctPiRJHPALPF4p5VphXc/AIlpCuCf/ivbkeW' +
        '4otdXMFsRzIfq+mohuHVgBKnNooXBlULLLpr4LeCwPyLyIA1B94QhCJyDxS2Dw7m7QP3+JAmEgo2goe2YMyvgwmfVEE' +
        'sNBH1dVQGf5BNpmxAd5EuaUhJzg+FF3vp813CzshkO33+Z0UUy+w7LgohaO5tjhd5UhrbXMFtwdeXx/9py6vlU66T98' +
        'qp4a9HCubgAAAABJRU5ErkJggg=='

    var title = $('#title').text();
    var authors = $('.lead').text().replace(/(\r\n|\n|\r)/gm, "").trim()
    var dateline = 'In ' + [
        $('.col dt:contains(Volume)').next().text(),
        $('.col dt:contains(Month)').next().text() + ' ' + $('.col dt:contains(Year)').next().text()
    ].join(', ')
    var abst = $('.acl-abstract').text().substring(8).replace(/(\r\n|\n|\r)/gm, "").trim()

    var body = [authors, dateline, '', abst, '', 'ACL Anthology: ' + window.location.href].join('\n')

    var gh_link = [
        'https://github.com/' + gh_username + '/' + gh_reponame + '/issues/new',
        '?title=' + encodeURIComponent(title),
        '&body=' + encodeURIComponent(body)
    ].join('')

    // Your code here...
    console.log('hello aclweb')
    console.log(title)
    console.log(body)

    var bm_gh = $('<a />').attr({
        href:  gh_link,
        class: 'btn btn-attachment d-flex flex-wrap justify-content-center',
        title: 'Bookmark on GitHub',
        target: '_blank'
    })
    var im_gh = $('<span />').attr({class: 'align-self-center px-1'}).appendTo(bm_gh)
    $('<img />').attr({src: gh_favicon_data,}).appendTo(im_gh)
    $('<span>').attr({class: 'px-1'}).text('GitHub').appendTo(bm_gh)

    $('.acl-paper-link-block a').last().after(bm_gh)
})();