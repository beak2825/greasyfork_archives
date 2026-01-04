// ==UserScript==
// @name         AScanner
// @namespace    http://dano.net/
// @version      0.1.2
// @description  jazz as usual!
// @author       studentx
// @match        http://ivk.petrsu.ru/mod/quiz/review.php?attempt=*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/alertifyjs-alertify.js/1.0.11/js/alertify.js
// @require      https://unpkg.com/firebase@5.0.1/firebase-app.js
// @require      https://unpkg.com/firebase@5.0.1/firebase-firestore.js
// @require      https://unpkg.com/firebase@5.0.1/firebase-storage.js
// @downloadURL https://update.greasyfork.org/scripts/368078/AScanner.user.js
// @updateURL https://update.greasyfork.org/scripts/368078/AScanner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const els = $('#region-main').find("div[id^='q']");
    let arrr = [];

    $.each(els, function( i, el ){
        let objj = {
            'question':$(el).find('.qtext').text(),
            'answer':$(el).find('.rightanswer').text().replace('The correct answers are: ','').replace('Правильный ответ: ', '')
        };
        arrr.push(objj);
    });

    alertify.log('Upload init');

    const config = {
        apiKey: "AIzaSyAeQtzS9iSUUySoohqIzR4aVSxuIgY7PR8",
        authDomain: "klim-db0b5.firebaseapp.com",
        databaseURL: "https://klim-db0b5.firebaseio.com",
        projectId: "klim-db0b5",
        storageBucket: "klim-db0b5.appspot.com",
        messagingSenderId: "774240962050"
    };
    firebase.initializeApp(config);

    const storage = firebase.storage();
    const storageRef = storage.ref();
    const backupRef = storageRef.child('backup_' + Date.now());
    const db = firebase.firestore();
    const settings = {timestampsInSnapshots: true};
    db.settings(settings);

    db.collection('questions').get().then((querySnapshot) => {
        let existQuestions = [];
        let existObjects = [];
        querySnapshot.forEach((doc) => {
            existQuestions.push(doc.data().question);
            existObjects.push(doc.data());
        });
        const myJSON = JSON.stringify(existObjects);
        backupRef.putString(myJSON).then(function(snapshot) {
            console.log('Uploaded a raw string!');
        });
        let willBeUploaded = 0;
        let currentUpload = 0;
        $.each(arrr, function( i, objj ){
            if ($.inArray(objj.question, existQuestions) < 0) {
                willBeUploaded++;
                db.collection('questions').add(objj)
                .then(function(docRef) {
                    currentUpload++;
                    alertify.maxLogItems(10).success("+1");
                    if (currentUpload == willBeUploaded) {
                        alertify.success("Upload done");
                    }
                    console.log("Document written with ID: ", docRef.id);
                })
                .catch(function(error) {
                    alertify.error("Error while uploading");
                    console.error("Error adding document: ", error);
                });
            }
        });
        console.log('willBeUploaded', willBeUploaded);
        if (willBeUploaded == 0) {
            alertify.success("Upload done");
        }
        console.log(existQuestions.length);
    });
})();