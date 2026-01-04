// ==UserScript==
// @name         Soundgasm Favorites
// @namespace    https://github.com/diggtrap
// @author       diggtrap
// @description  Adds a favorite button to Soundgasm.net audio posts and displays favorited posts on the main page when logged in.
// @include      https://soundgasm.net/*
// @icon         https://i.imgur.com/BwX91V0.png
// @version      1.303
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/491507/Soundgasm%20Favorites.user.js
// @updateURL https://update.greasyfork.org/scripts/491507/Soundgasm%20Favorites.meta.js
// ==/UserScript==

// Customization options
const buttonColor = "#444"; // Button color (change as needed)
const textStyle = { // Text style attributes
    fontWeight: "normal", // Change to "bold" for bold weight
    fontSize: "14px"      // Change font size as needed
};
const notificationDuration = 1000; // Notification duration in milliseconds

// Main function to add favorite button and display favorites list
function main() {
    if (isAudioPage() && !isWelcomePage()) {
        addFavoriteButton();
    }

    if (isWelcomePage()) {
        displayFavoritesList();
    }
}

// Check if the current page contains an audio post
function isAudioPage() {
    return $(".jp-title").length > 0;
}

// Check if the current page is the welcome page
function isWelcomePage() {
    return $("body:contains('Welcome to soundgasm')").length > 0 && $("body:contains('Logout')").length > 0;
}

// Add favorite button to audio post page
function addFavoriteButton() {
    const audioTitle = $(".jp-title").text().trim();
    let isFavorited = isAudioFavorited(audioTitle); // Check if the audio is already favorited

    const favoriteButton = $("<button><span class='star-icon'>☆</span> Add to Favorites</button>").css({
        position: "fixed",
        bottom: "20px",
        left: "20px",
        padding: "10px",
        backgroundColor: buttonColor,
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        textDecoration: "none",
        fontWeight: textStyle.fontWeight,
        fontSize: textStyle.fontSize
    });

    if (isFavorited) {
        favoriteButton.html("<span class='star-icon'>★</span> Remove from Favorites");
    }

    favoriteButton.on("click", function() {
        if (isFavorited) {
            removeFromFavorites(audioTitle);
            favoriteButton.html("<span class='star-icon'>☆</span> Add to Favorites");
            showNotification("Audio removed from favorites.", notificationDuration);
        } else {
            addToFavorites(audioTitle, window.location.href);
            favoriteButton.html("<span class='star-icon'>★</span> Remove from Favorites");
            showNotification("Audio added to favorites.", notificationDuration);
        }
        isFavorited = !isFavorited; // Toggle the favorited state
    });

    $("body").append(favoriteButton);
}

// Display favorites list on the welcome page
function displayFavoritesList() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const favoritesList = $("<ul style='list-style-type: none; padding: 0;'>").append(
        favorites.map(favorite => {
            // Extract the text before the second set of square brackets
            const match = favorite.title.match(/\[.*?\](.*?)(?=\[|$)/);
            const audioTitle = match ? match[0] : favorite.title;

            return $("<li style='margin-bottom: 10px;'>").append(
                $("<a>").attr("href", favorite.url).attr("target", "_blank").css({
                    textDecoration: "none",
                    color: "#444"
                }).text(`${audioTitle} by ${favorite.creator}`)
            );
        })
    );

    if (favorites.length > 0) {
        $("body").append($("<h1 style='font-size: 24px; margin-bottom: 20px;'>").text("My Favorites"), favoritesList);
    } else {
        $("body").append($("<h1 style='font-size: 24px;'>").text("No favorited audios yet."));
    }
}

// Function to check if an audio is favorited
function isAudioFavorited(title) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites.some(favorite => favorite.title === title);
}

// Function to add an audio to favorites
function addToFavorites(title, url) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const creator = window.location.href.match(/\/u\/([^\/]+)/)[1];
    favorites.push({ title: title, url: url, creator: creator });
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Function to remove an audio from favorites
function removeFromFavorites(title) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter(favorite => favorite.title !== title);
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Function to show notification
function showNotification(message, duration) {
    // Clear existing notifications
    $(".notification").remove();

    // Create new notification
    const notification = $("<div>").addClass("notification").text(message).css({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "10px",
        backgroundColor: "#3498db",
        color: "white",
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
    });
    $("body").append(notification);

    // Remove notification after duration
    setTimeout(function() {
        notification.fadeOut(1000, function() {
            $(this).remove();
        });
    }, duration);
}

// Run main function
main();
