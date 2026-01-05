/*
 *  name         CSRF Grabber
 *  namespace    pxgamer
 *  version      0.2
 *  description  A library for getting the current csrf token for POSTs on Kickass Torrents.
 *  author       pxgamer
 */

function csrf() {
    'use strict';

    return $('form input[name="csrf_token"]').val();
}
