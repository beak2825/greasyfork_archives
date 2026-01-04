// ==UserScript==
// @name         MMT Music Panel
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  A modern music pick list panel with YouTube integration
// @author       MMT
// @match        https://docs.google.com/*
// @match        https://docs.google.com/*
// @grant        none
// @icon         https://img.icons8.com/ios-filled/50/000000/music.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js
// @downloadURL https://update.greasyfork.org/scripts/511965/MMT%20Music%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/511965/MMT%20Music%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Load YouTube API script
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

   // Create the main panel container
const panel = document.createElement('div');
panel.id = 'music-panel';
panel.style.cssText = `
   position: fixed;
   bottom: 30px;
   right: 30px;
   width: 380px; /* Slimmer width */
   max-height: 600px; /* Taller for a more elegant look */
   background: linear-gradient(135deg, #1E3C72, #2A5298); /* Cooler blue tones with a smooth gradient */
   color: #F0F0F0; /* Softer off-white text for better contrast */
   border-radius: 24px; /* Slightly less rounded for a more refined look */
   padding: 20px;
   box-shadow: 0 15px 45px rgba(0, 0, 0, 0.6); /* Moderate shadow for depth without overwhelming */
   display: none;
   overflow: hidden;
   transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
   font-family: 'Poppins', sans-serif;
   z-index: 1000;
   border: 2px solid rgba(100, 160, 220, 0.8); /* Cool-toned blue border */
   backdrop-filter: blur(10px); /* Glass-like effect, not too strong */
   opacity: 0.97; /* Slight transparency for modern feel */
   transform: scale(1); /* Default scale for smooth scaling animations */

   /* Hover effect for interactivity */
   &:hover {
      transform: scale(1.03); /* Slight scale-up on hover */
      box-shadow: 0 25px 70px rgba(0, 0, 0, 0.75); /* Stronger shadow for hover effect */
   }
`;

// You can then append this panel to the body or any other container
document.body.appendChild(panel);

// Adding a smooth transition for opening/closing
panel.style.transform = 'translateY(100%)';
panel.style.transition = 'transform 0.3s ease-in-out';

// Function to show the panel
function showPanel() {
    panel.style.display = 'block';
    setTimeout(() => {
        panel.style.transform = 'translateY(0)';
    }, 10); // Delay to ensure the display change is applied
}

// Function to hide the panel
function hidePanel() {
    panel.style.transform = 'translateY(100%)';
    setTimeout(() => {
        panel.style.display = 'none';
    }, 300); // Delay to match the transition duration
}

// Example usage: Show the panel
showPanel(); // Call this function to show the panel

document.body.appendChild(panel);

    // Header section
const header = document.createElement('div');
header.innerHTML = `
  <strong style="display: block; font-size: 22px; color:  #FFDA44; margin-bottom: 5px;">
    Now Playing
  </strong>
  <span id="currently-playing" style="font-size: 18px; color: #EAEAEA;">
    None
  </span>
`;
header.style.cssText = `
  background-color: rgba(255, 255, 255, 0.1); /* Soft transparent background */
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
  border-radius: 12px; /* Rounded edges for a softer look */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4); /* Adds depth with a subtle shadow */
  backdrop-filter: blur(5px); /* Glass-like effect */
`;
panel.appendChild(header);

// Track List with thumbnails and gradients
const tracks = [
    { title: "Happy - Pharrell Williams", duration: "3:53", videoId: "ZbZSe6AiEP0", icon: "fa-smile", color: "#FFD700" },
    { title: "Levitating - Dua Lipa", duration: "3:23", videoId: "Yg8fY0JTAw8", icon: "fa-music", color: "#FF69B4" },
    { title: "Shut Up and Dance - WALK THE MOON", duration: "3:38", videoId: "6JX2eWqS7N0", icon: "fa-dance", color: "#32CD32" },
    { title: "Titanium - David Guetta ft. Sia", duration: "4:05", videoId: "J8I5B0dj4oY", icon: "fa-music", color: "#4682B4" },
    { title: "Bailando - Enrique Iglesias ft. Sean Paul", duration: "4:00", videoId: "NUaOzk2qU6A", icon: "fa-music", color: "#FF4500" },
    { title: "Mr. Brightside - The Killers", duration: "3:42", videoId: "1m5c4g6v3y8", icon: "fa-music", color: "#FF6347" },
    { title: "Don't Start Now - Dua Lipa", duration: "3:03", videoId: "oygrm2D5H7E", icon: "fa-music", color: "#9370DB" },
    { title: "Blinding Lights - The Weeknd", duration: "3:20", videoId: "4NRXx6U8ABQ", icon: "fa-music", color: "#FF69B4" },
    { title: "Someone You Loved - Lewis Capaldi", duration: "3:02", videoId: "Q0z8fZTjB2k", icon: "fa-heart", color: "#6A5ACD" },
    { title: "I Gotta Feeling - The Black Eyed Peas", duration: "4:49", videoId: "uA_NyeDIF_0", icon: "fa-music", color: "#FF7F50" },
    { title: "Cool for the Summer - Demi Lovato", duration: "3:41", videoId: "7QezW6dR53g", icon: "fa-sun", color: "#FF1493" },
    { title: "Watermelon Sugar - Harry Styles", duration: "3:07", videoId: "E07s5byw8Zg", icon: "fa-music", color: "#FF6347" },
    { title: "Old Town Road - Lil Nas X ft. Billy Ray Cyrus", duration: "2:37", videoId: "5n3T3WcY4Vg", icon: "fa-music", color: "#8B4513" },
    { title: "Firework - Katy Perry", duration: "3:48", videoId: "QGJuMBdaqIw", icon: "fa-fire", color: "#FF4500" },
    { title: "Say So - Doja Cat", duration: "3:58", videoId: "nHfXwq3lQGs", icon: "fa-music", color: "#FF69B4" },
    { title: "One Dance - Drake ft. Wizkid & Kyla", duration: "2:54", videoId: "H2cYVzg1QXs", icon: "fa-music", color: "#4682B4" },
    { title: "Call Me Maybe - Carly Rae Jepsen", duration: "3:14", videoId: "fWNaR-rx8uE", icon: "fa-music", color: "#FF1493" },
    { title: "Rude - MAGIC!", duration: "3:44", videoId: "PIZ2e1tF3wE", icon: "fa-music", color: "#32CD32" },
    { title: "Somebody That I Used to Know - Gotye ft. Kimbra", duration: "4:05", videoId: "8UVNT4wvIGY", icon: "fa-heart", color: "#6A5ACD" },
    { title: "A Thousand Years - Christina Perri", duration: "4:42", videoId: "UVuG9iQ9BqY", icon: "fa-heart", color: "#FF6347" },
    { title: "Rolling in the Deep - Adele", duration: "3:48", videoId: "rY0WxgSXdEE", icon: "fa-music", color: "#B22222" },
    { title: "Like I Can - Sam Smith", duration: "3:22", videoId: "U54CkNacNNg", icon: "fa-music", color: "#FF4500" },
    { title: "Stay With Me - Sam Smith", duration: "2:52", videoId: "pU0sTrsA3mM", icon: "fa-heart", color: "#32CD32" },
    { title: "When I Was Your Man - Bruno Mars", duration: "3:33", videoId: "yRpdA9DBn9g", icon: "fa-heart", color: "#FF6347" },
    { title: "Cry Me a River - Justin Timberlake", duration: "4:50", videoId: "I1ESFUpvDgE", icon: "fa-music", color: "#4682B4" },
    { title: "Grenade - Bruno Mars", duration: "3:42", videoId: "SRv9RHzFM4Y", icon: "fa-heart", color: "#FF7F50" },
    { title: "Beautiful - Christina Aguilera", duration: "3:58", videoId: "eA2sQ0WZk7s", icon: "fa-music", color: "#FF69B4" },
    { title: "Bleeding Love - Leona Lewis", duration: "4:22", videoId: "uG6UjE38QmA", icon: "fa-heart", color: "#FF4500" },
    { title: "Just the Way You Are - Bruno Mars", duration: "3:40", videoId: "LjhCEhWiKXk", icon: "fa-heart", color: "#FFD700" },
    { title: "Back to December - Taylor Swift", duration: "4:54", videoId: "ZjoKYC54C1E", icon: "fa-heart", color: "#FF6347" },
    { title: "Let Her Go - Passenger", duration: "4:12", videoId: "G7KXxqN9q6I", icon: "fa-music", color: "#6A5ACD" },
    { title: "Someone Like You - Adele", duration: "4:45", videoId: "hLQl3WQQoQ0", icon: "fa-heart", color: "#FF1493" },
    { title: "You Are the Reason - Calum Scott", duration: "3:25", videoId: "W5u72Ch15nY", icon: "fa-heart", color: "#32CD32" },
    { title: "Scars to Your Beautiful - Alessia Cara", duration: "3:35", videoId: "Yh0w3qCBo8s", icon: "fa-music", color: "#FF69B4" },
    { title: "Fight Song - Rachel Platten", duration: "3:24", videoId: "xoM_VyV8I8Y", icon: "fa-music", color: "#4682B4" },
    { title: "Runaway - Aurora", duration: "3:35", videoId: "CkKp7W0HhFY", icon: "fa-music", color: "#6A5ACD" },
    { title: "Fight for You - H.E.R.", duration: "3:28", videoId: "Z7_w9vBQQ10", icon: "fa-music", color: "#FF4500" },
    { title: "All of Me - John Legend", duration: "4:29", videoId: "450pB1Z00F8", icon: "fa-heart", color: "#FF6347" },
    { title: "Never Be the Same - Camila Cabello", duration: "3:46", videoId: "mRo9hhcf0wI", icon: "fa-music", color: "#FF7F50" },
    { title: "Adore You - Harry Styles", duration: "3:27", videoId: "z1UPfZw1mc0", icon: "fa-music", color: "#FF6347" },
    { title: "Shape of You - Ed Sheeran", duration: "3:53", videoId: "JGwWNGJdvx8", icon: "fa-music", color: "#FF4500" },
    { title: "Dance Monkey - Tones and I", duration: "3:29", videoId: "q0h6dU9W8R8", icon: "fa-music", color: "#FFD700" },
    { title: "Sucker - Jonas Brothers", duration: "3:01", videoId: "C1vAIF06M-M", icon: "fa-music", color: "#32CD32" },
    { title: "Happier - Marshmello ft. Bastille", duration: "3:34", videoId: "g10z7Q1FfFA", icon: "fa-music", color: "#FF69B4" },
    { title: "Break Free - Ariana Grande ft. Zedd", duration: "3:34", videoId: "S7x-VF8eSOI", icon: "fa-music", color: "#6A5ACD" },
    { title: "Counting Stars - OneRepublic", duration: "4:17", videoId: "hY7m5jjJ9mI", icon: "fa-music", color: "#FF4500" },
    { title: "No Tears Left to Cry - Ariana Grande", duration: "3:25", videoId: "D1S18oyT6D0", icon: "fa-music", color: "#FF6347" },
    { title: "Truth Hurts - Lizzo", duration: "2:53", videoId: "z4qWv1b7dIU", icon: "fa-music", color: "#FF69B4" },
    { title: "Starboy - The Weeknd ft. Daft Punk", duration: "3:50", videoId: "34Na4j8AVgA", icon: "fa-music", color: "#4682B4" },
    { title: "Perfect - Ed Sheeran", duration: "4:23", videoId: "2Vv-BfVoq4g", icon: "fa-heart", color: "#FF6347" },
    { title: "Rockabye - Clean Bandit ft. Sean Paul & Anne-Marie", duration: "4:11", videoId: "J9Nf6mKXg0U", icon: "fa-music", color: "#FFD700" },
    { title: "Say You Won't Let Go - James Arthur", duration: "3:31", videoId: "0yJXkRSRvdA", icon: "fa-heart", color: "#FF4500" },
    { title: "Ain't It Fun - Paramore", duration: "4:00", videoId: "S1DgD9K9QOk", icon: "fa-music", color: "#FF6347" },
    { title: "Girls Like You - Maroon 5 ft. Cardi B", duration: "3:31", videoId: "aW8r1b3W2n0", icon: "fa-music", color: "#32CD32" },
    { title: "Good as Hell - Lizzo", duration: "2:39", videoId: "dE8X2dY8_6A", icon: "fa-smile", color: "#FF69B4" },
    { title: "Someone You Loved - Lewis Capaldi", duration: "3:02", videoId: "Q0z8fZTjB2k", icon: "fa-heart", color: "#6A5ACD" },
    { title: "Best Part - Daniel Caesar ft. H.E.R.", duration: "4:02", videoId: "QGvM3Kk6H80", icon: "fa-heart", color: "#FF6347" },
    { title: "Love on Top - Beyoncé", duration: "4:27", videoId: "wA3bG3W2W4s", icon: "fa-heart", color: "#FFD700" },
    { title: "Dusk Till Dawn - Zayn ft. Sia", duration: "4:01", videoId: "Qk2wY4vSkB0", icon: "fa-music", color: "#4682B4" },
    { title: "Too Good at Goodbyes - Sam Smith", duration: "3:21", videoId: "6b3uRa8i4dA", icon: "fa-heart", color: "#FF4500" },
    { title: "Lose You to Love Me - Selena Gomez", duration: "3:26", videoId: "zD8NrWhA5D0", icon: "fa-heart", color: "#FF69B4" },
    { title: "Believer - Imagine Dragons", duration: "3:24", videoId: "7wtjx9nXt5s", icon: "fa-music", color: "#32CD32" },
    { title: "Youngblood - 5 Seconds of Summer", duration: "3:18", videoId: "7dIr6RNYlW8", icon: "fa-music", color: "#4682B4" },
    { title: "Shallow - Lady Gaga & Bradley Cooper", duration: "3:36", videoId: "bo_6WzQH2EY", icon: "fa-heart", color: "#B22222" },
    { title: "Say So - Doja Cat", duration: "3:58", videoId: "5f2bN8qEtW0", icon: "fa-music", color: "#FF6347" },
    { title: "Watermelon Sugar - Harry Styles", duration: "3:07", videoId: "E07s5BYtF5g", icon: "fa-music", color: "#FFD700" },
    { title: "Butter - BTS", duration: "2:44", videoId: "U5zEx8qj2p4", icon: "fa-music", color: "#FF4500" },
    { title: "Peaches - Justin Bieber ft. Daniel Caesar & Giveon", duration: "3:18", videoId: "k5p7i1M0D0A", icon: "fa-music", color: "#32CD32" },
    { title: "Feel Good Inc. - Gorillaz", duration: "3:41", videoId: "ZLQ2M2G6xO8", icon: "fa-music", color: "#6A5ACD" },
    { title: "Everything I Wanted - Billie Eilish", duration: "4:05", videoId: "h1gO9SFPQiY", icon: "fa-heart", color: "#FF69B4" },
    { title: "Stitches - Shawn Mendes", duration: "3:27", videoId: "ZB-3Z0Q-7Vg", icon: "fa-music", color: "#FF6347" },
    { title: "Rude - MAGIC!", duration: "3:44", videoId: "P2sD8rWzGTA", icon: "fa-music", color: "#FFD700" },
    { title: "Happy - Pharrell Williams", duration: "3:53", videoId: "ZbQ43Rho_70", icon: "fa-smile", color: "#FF4500" },
    { title: "Blinding Lights - The Weeknd", duration: "3:20", videoId: "4NRXx6U8ABQ", icon: "fa-music", color: "#32CD32" },
    { title: "Don't Start Now - Dua Lipa", duration: "3:03", videoId: "oyGR0f0PVt0", icon: "fa-music", color: "#6A5ACD" },
    { title: "Take Me to Church - Hozier", duration: "4:01", videoId: "PVjiKRfKp7I", icon: "fa-music", color: "#FF6347" },
    { title: "I Will Always Love You - Whitney Houston", duration: "4:31", videoId: "k1fA1HplWcY", icon: "fa-heart", color: "#FF69B4" },
    { title: "Umbrella - Rihanna ft. Jay-Z", duration: "4:35", videoId: "JkON8B9iBBI", icon: "fa-music", color: "#B22222" },
    { title: "Crazy - Gnarls Barkley", duration: "3:06", videoId: "nZ7kMxQGmR8", icon: "fa-music", color: "#32CD32" },
    { title: "Dancing with a Stranger - Sam Smith & Normani", duration: "3:22", videoId: "DJFTzBXnAVw", icon: "fa-heart", color: "#FF6347" },
    { title: "Shut Up and Dance - WALK THE MOON", duration: "3:38", videoId: "6bNUQhJ7dd0", icon: "fa-music", color: "#FF4500" },
    { title: "Let Me Love You - Mario", duration: "4:10", videoId: "qUws1j1YJgI", icon: "fa-heart", color: "#FFD700" },
    { title: "On The Floor - Jennifer Lopez ft. Pitbull", duration: "3:48", videoId: "hYwW4LkD2r0", icon: "fa-music", color: "#32CD32" },
    { title: "I Gotta Feeling - The Black Eyed Peas", duration: "4:49", videoId: "uJ_1J3D54cM", icon: "fa-music", color: "#FF6347" },
    { title: "One Dance - Drake ft. Wizkid & Kyla", duration: "2:53", videoId: "gY2kMYI4a4I", icon: "fa-music", color: "#6A5ACD" },
    { title: "Shivers - Ed Sheeran", duration: "3:27", videoId: "M6GxY3syg0M", icon: "fa-music", color: "#B22222" },
    { title: "Stay - The Kid LAROI & Justin Bieber", duration: "2:21", videoId: "Y4-9OXZz36g", icon: "fa-music", color: "#FF69B4" },
    { title: "Don't Speak - No Doubt", duration: "4:22", videoId: "gxgiPqQY4Ww", icon: "fa-music", color: "#FF4500" },
    { title: "Teenage Dream - Katy Perry", duration: "3:47", videoId: "c3Wm7LU2LwU", icon: "fa-heart", color: "#FFD700" },
    { title: "Summer - Calvin Harris", duration: "3:43", videoId: "ebXbU6pE0X0", icon: "fa-music", color: "#32CD32" },
    { title: "Just the Way You Are - Bruno Mars", duration: "3:40", videoId: "LihWajS5dQw", icon: "fa-heart", color: "#FF6347" },
    { title: "Chasing Cars - Snow Patrol", duration: "4:27", videoId: "Miw7MYJ5VjI", icon: "fa-heart", color: "#6A5ACD" },
    { title: "Hotline Bling - Drake", duration: "3:39", videoId: "uxb2rcw2RjU", icon: "fa-music", color: "#FF4500" },
    { title: "Ride - Twenty One Pilots", duration: "3:34", videoId: "y6pTWYQGWEw", icon: "fa-music", color: "#FFD700" },
    { title: "Love Me Like You Do - Ellie Goulding", duration: "4:10", videoId: "mY8b1bh8gWc", icon: "fa-heart", color: "#FF69B4" },
    { title: "Bailando - Enrique Iglesias ft. Sean Paul", duration: "4:00", videoId: "ngkB_3c2xzY", icon: "fa-music", color: "#32CD32" },
    { title: "All of Me - John Legend", duration: "4:30", videoId: "450pW9GLZEk", icon: "fa-heart", color: "#6A5ACD" },
    { title: "Boo'd Up - Ella Mai", duration: "3:22", videoId: "y7LvjWgXnSc", icon: "fa-heart", color: "#FF6347" },
    { title: "What Makes You Beautiful - One Direction", duration: "3:20", videoId: "QKQ70zGEYf4", icon: "fa-music", color: "#FFD700" },
    { title: "Party in the USA - Miley Cyrus", duration: "3:23", videoId: "GQb-Ft3z5Nc", icon: "fa-music", color: "#FF4500" },
    { title: "Firework - Katy Perry", duration: "3:48", videoId: "QG8d4K2A8gA", icon: "fa-music", color: "#FF6347" },
    { title: "Shape of You - Ed Sheeran", duration: "3:53", videoId: "JGwWNGJdvx8", icon: "fa-music", color: "#FFD700" },
    { title: "A Thousand Years - Christina Perri", duration: "4:45", videoId: "rtOvBOTyX00", icon: "fa-heart", color: "#6A5ACD" },
    { title: "Halo - Beyoncé", duration: "4:21", videoId: "5P2XnGg92Lk", icon: "fa-heart", color: "#FF69B4" },
    { title: "Rolling in the Deep - Adele", duration: "3:48", videoId: "rY0WxgSXdEE", icon: "fa-music", color: "#B22222" },
    { title: "Sugar - Maroon 5", duration: "3:55", videoId: "09R8_2nJtjg", icon: "fa-music", color: "#FF4500" },
    { title: "Thinking Out Loud - Ed Sheeran", duration: "4:41", videoId: "lp-EO5Iu0w", icon: "fa-heart", color: "#32CD32" },
    { title: "Somebody That I Used to Know - Gotye", duration: "4:05", videoId: "8UVNT4wvIGY", icon: "fa-music", color: "#6A5ACD" },
    { title: "Taki Taki - DJ Snake ft. Selena Gomez, Ozuna & Cardi B", duration: "3:33", videoId: "f7akHx9JjOc", icon: "fa-music", color: "#FF6347" },
    { title: "Finesse - Bruno Mars ft. Cardi B", duration: "3:12", videoId: "wXbN0xHzd5U", icon: "fa-music", color: "#FFD700" },
    { title: "Seven Nation Army - The White Stripes", duration: "3:32", videoId: "0J3J6v3k8i0", icon: "fa-music", color: "#B22222" },
    { title: "Love Story - Taylor Swift", duration: "3:55", videoId: "8xg8yY0ScFQ", icon: "fa-heart", color: "#FF4500" },
    { title: "Wrecking Ball - Miley Cyrus", duration: "3:41", videoId: "My2FRPA3Gf8", icon: "fa-heart", color: "#FFD700" },
    { title: "Stay With Me - Sam Smith", duration: "2:52", videoId: "pY9cI7hD-3Y", icon: "fa-heart", color: "#32CD32" },
    { title: "Never Gonna Give You Up - Rick Astley", duration: "3:32", videoId: "dQw4w9WgXcQ", icon: "fa-music", color: "#FF6347" },
    { title: "Rich Girl - Gwen Stefani ft. Eve", duration: "3:56", videoId: "qXg9WJQiUs8", icon: "fa-music", color: "#FFD700" },
    { title: "Bad Guy - Billie Eilish", duration: "3:14", videoId: "DyD4dM9N3o8", icon: "fa-music", color: "#B22222" },
    { title: "The Middle - Zedd, Maren Morris & Grey", duration: "3:02", videoId: "1TY1vO4xS38", icon: "fa-music", color: "#6A5ACD" },
    { title: "Old Town Road - Lil Nas X ft. Billy Ray Cyrus", duration: "2:38", videoId: "0KSOMA3QBU0", icon: "fa-music", color: "#FF4500" },
    { title: "Good as Hell - Lizzo", duration: "2:38", videoId: "u1RZwG5nD1g", icon: "fa-music", color: "#FFD700" },
    { title: "I Will Always Love You - Whitney Houston", duration: "4:31", videoId: "kE0z3Kz6Z7o", icon: "fa-heart", color: "#B22222" },
    { title: "All About That Bass - Meghan Trainor", duration: "3:10", videoId: "7cE3N6aYgqU", icon: "fa-music", color: "#FF69B4" },
    { title: "Don't Let Me Down - The Chainsmokers ft. Daya", duration: "3:28", videoId: "8d_6nAfLPAw", icon: "fa-music", color: "#32CD32" },
    { title: "I Don't Care - Ed Sheeran & Justin Bieber", duration: "3:23", videoId: "YStZLgCybZg", icon: "fa-music", color: "#FF6347" },
    { title: "Uptown Funk - Mark Ronson ft. Bruno Mars", duration: "4:30", videoId: "OPf0Y6YaJU0", icon: "fa-music", color: "#FFD700" },
    { title: "Can't Stop the Feeling! - Justin Timberlake", duration: "3:56", videoId: "ru0KPV5yZeg", icon: "fa-music", color: "#FF4500" },
    { title: "New Rules - Dua Lipa", duration: "3:29", videoId: "w3eWmHHTyI4", icon: "fa-music", color: "#6A5ACD" },
    { title: "Dance Monkey - Tones and I", duration: "3:29", videoId: "q0zWhwP4FJ4", icon: "fa-music", color: "#32CD32" },
    { title: "Goodbye Yellow Brick Road - Elton John", duration: "3:13", videoId: "yD7F2tLo8nE", icon: "fa-music", color: "#B22222" },
    { title: "Creep - Radiohead", duration: "3:58", videoId: "0fYz62MB6j4", icon: "fa-music", color: "#FF6347" },
    { title: "Hot in Herre - Nelly", duration: "3:50", videoId: "YHuc2cSwG0Q", icon: "fa-music", color: "#FFD700" },
    { title: "Say So - Doja Cat", duration: "3:58", videoId: "I6Y_7Q-w9Ok", icon: "fa-music", color: "#FF69B4" },
    { title: "Back to Black - Amy Winehouse", duration: "4:01", videoId: "U7cO6OBcOAI", icon: "fa-heart", color: "#6A5ACD" },
    { title: "Break Free - Ariana Grande ft. Zedd", duration: "3:34", videoId: "LzA4qluXveQ", icon: "fa-music", color: "#32CD32" },
    { title: "Despacito - Luis Fonsi ft. Daddy Yankee", duration: "3:47", videoId: "kJQP7kiw5Fk", icon: "fa-music", color: "#FF6347" },
    { title: "All of the Stars - Ed Sheeran", duration: "3:55", videoId: "raZ4u3g8AOI", icon: "fa-heart", color: "#FFD700" },
    { title: "Mr. Brightside - The Killers", duration: "3:42", videoId: "1C0l_gZ6QKo", icon: "fa-music", color: "#B22222" },
    { title: "Paparazzi - Lady Gaga", duration: "3:28", videoId: "s7KzLPuYndE", icon: "fa-music", color: "#FF4500" },
    { title: "Sk8er Boi - Avril Lavigne", duration: "3:23", videoId: "4Y59w8gE5ZI", icon: "fa-music", color: "#6A5ACD" },
    { title: "Teenage Dream - Katy Perry", duration: "3:47", videoId: "QyEvIuFZgfE", icon: "fa-heart", color: "#32CD32" },
    { title: "Lose Yourself - Eminem", duration: "5:20", videoId: "xq9D1PHaA4c", icon: "fa-music", color: "#8B0000" },
    { title: "Shallow - Lady Gaga & Bradley Cooper", duration: "3:36", videoId: "bo_8E8X9dxE", icon: "fa-heart", color: "#FFD700" },
    { title: "Sweet Caroline - Neil Diamond", duration: "3:21", videoId: "3a4GdbQuZcI", icon: "fa-music", color: "#FF6347" },
    { title: "Billie Jean - Michael Jackson", duration: "4:54", videoId: "Zi_XLOBDo_Y", icon: "fa-music", color: "#32CD32" },
    { title: "Rolling in the Deep - Adele", duration: "3:48", videoId: "rY0WxgSXdEE", icon: "fa-heart", color: "#6A5ACD" },
    { title: "Someone You Loved - Lewis Capaldi", duration: "3:02", videoId: "XqWz5wN8NaY", icon: "fa-music", color: "#B22222" },
    { title: "Runaway - Kanye West", duration: "9:08", videoId: "A8KIVT4C6Io", icon: "fa-music", color: "#FF69B4" },
    { title: "What Makes You Beautiful - One Direction", duration: "3:18", videoId: "QJO3ROT-A4E", icon: "fa-music", color: "#FF6347" },
    { title: "Boulevard of Broken Dreams - Green Day", duration: "4:21", videoId: "Soa1vQWkW4M", icon: "fa-music", color: "#FFD700" },
    { title: "Stay - Rihanna ft. Mikky Ekko", duration: "4:00", videoId: "wA4F_Vg4z1M", icon: "fa-heart", color: "#6A5ACD" },
    { title: "Born This Way - Lady Gaga", duration: "4:20", videoId: "wV2fD4ZLlJk", icon: "fa-music", color: "#B22222" },
    { title: "Girls Like You - Maroon 5 ft. Cardi B", duration: "3:31", videoId: "aK3pU0GRSHI", icon: "fa-music", color: "#32CD32" },
    { title: "Thunder - Imagine Dragons", duration: "3:07", videoId: "U4I2sR5eVnE", icon: "fa-music", color: "#FF4500" },
    { title: "Perfect - Ed Sheeran", duration: "4:23", videoId: "2Vv-BfVoq4g", icon: "fa-heart", color: "#FF69B4" },
    { title: "Can't Feel My Face - The Weeknd", duration: "3:35", videoId: "KEI4qCD1mXk", icon: "fa-music", color: "#FFD700" },
    { title: "Radioactive - Imagine Dragons", duration: "3:06", videoId: "ktvTqknM-4U", icon: "fa-music", color: "#32CD32" },
    { title: "Ice Ice Baby - Vanilla Ice", duration: "4:00", videoId: "rogmI3Y9nOg", icon: "fa-music", color: "#B22222" },
    { title: "Counting Stars - OneRepublic", duration: "4:17", videoId: "H8Zg3iJzOkc", icon: "fa-music", color: "#FF4500" },
    { title: "Bubbly - Colbie Caillat", duration: "3:17", videoId: "D_fEo7Z_CG4", icon: "fa-heart", color: "#6A5ACD" },
    { title: "Rude - MAGIC!", duration: "3:44", videoId: "PIuRO0JlJdY", icon: "fa-music", color: "#FF6347" },
    { title: "Wake Me Up - Avicii", duration: "4:07", videoId: "IcrbM1l_BoI", icon: "fa-music", color: "#FF8C00" },
    { title: "Shape of You - Ed Sheeran", duration: "3:53", videoId: "JGwWNGJdvx8", icon: "fa-music", color: "#FFD700" },
    { title: "Thinking Out Loud - Ed Sheeran", duration: "4:41", videoId: "lp-EO5IuInI", icon: "fa-heart", color: "#B22222" },
    { title: "Rolling in the Deep - Adele", duration: "3:48", videoId: "rY0WxgSXdEE", icon: "fa-music", color: "#6A5ACD" },
    { title: "Say You Won't Let Go - James Arthur", duration: "3:31", videoId: "0ks_4Z1T2aU", icon: "fa-heart", color: "#32CD32" },
    { title: "Lose Control - Missy Elliott ft. Ciara & Fatman Scoop", duration: "3:46", videoId: "EzB19v1zvNc", icon: "fa-music", color: "#FF69B4" },
    { title: "Party in the USA - Miley Cyrus", duration: "3:21", videoId: "M11SvDtPBj0", icon: "fa-music", color: "#FF6347" },
    { title: "Best of Me - The Afterglow", duration: "3:38", videoId: "iSQp7Oa3wCw", icon: "fa-music", color: "#8A2BE2" },
    { title: "Shut Up and Dance - WALK THE MOON", duration: "3:38", videoId: "6JGkF5h5G1k", icon: "fa-music", color: "#FF8C00" },
    { title: "Havana - Camila Cabello ft. Young Thug", duration: "3:37", videoId: "HCjNJDNzw8Y", icon: "fa-music", color: "#FF69B4" },
    { title: "Titanium - David Guetta ft. Sia", duration: "4:05", videoId: "JRfuAukIJWE", icon: "fa-music", color: "#32CD32" },
    { title: "Just the Way You Are - Bruno Mars", duration: "3:40", videoId: "LjhCEhWiKXk", icon: "fa-heart", color: "#FFD700" },
    { title: "My Heart Will Go On - Celine Dion", duration: "4:40", videoId: "FHGqH3u9SRA", icon: "fa-heart", color: "#B22222" },
    { title: "Boys Don't Cry - The Cure", duration: "2:35", videoId: "y5R6aRGY89A", icon: "fa-music", color: "#6A5ACD" },
    { title: "Finesse - Bruno Mars ft. Cardi B", duration: "3:11", videoId: "n2WqI_lL6bs", icon: "fa-music", color: "#FF4500" },
    { title: "We Found Love - Rihanna ft. Calvin Harris", duration: "3:35", videoId: "oP4u6KddFq8", icon: "fa-music", color: "#FF69B4" },
    { title: "You Are The Reason - Calum Scott", duration: "3:27", videoId: "bB1EUT1NmpA", icon: "fa-heart", color: "#32CD32" },
    { title: "What Do You Mean? - Justin Bieber", duration: "3:25", videoId: "uYg0kBbY4fM", icon: "fa-music", color: "#FFD700" },
    { title: "I Gotta Feeling - The Black Eyed Peas", duration: "4:49", videoId: "uS2ANqU5O-s", icon: "fa-music", color: "#8A2BE2" },
    { title: "Blurred Lines - Robin Thicke ft. T.I. & Pharrell", duration: "4:23", videoId: "y8ik1wDafg4", icon: "fa-music", color: "#FF6347" },
    { title: "Uptown Funk - Mark Ronson ft. Bruno Mars", duration: "4:30", videoId: "OPf0y2y53Z8", icon: "fa-music", color: "#FF4500" },
    { title: "Shape of You - Ed Sheeran", duration: "3:53", videoId: "JGwWNGJdvx8", icon: "fa-user-friends", color: "#FF6347" },
    { title: "Stay - Rihanna ft. Mikky Ekko", duration: "4:00", videoId: "JFY4tO_6qTY", icon: "fa-heart", color: "#4682B4" },
    { title: "Rolling in the Deep - Adele", duration: "3:48", videoId: "rY0WxgSXdEE", icon: "fa-music", color: "#FF1493" },
    { title: "Perfect - Ed Sheeran", duration: "4:23", videoId: "2Vv-BfVoq4g", icon: "fa-heart", color: "#FFD700" },
    { title: "Thinking Out Loud - Ed Sheeran", duration: "4:41", videoId: "lp-EO5Iu1H0", icon: "fa-music", color: "#6A5ACD" },
    { title: "Shallow - Lady Gaga & Bradley Cooper", duration: "3:36", videoId: "bo_efYhYU2A", icon: "fa-user-friends", color: "#B22222" },
    { title: "Despacito - Luis Fonsi ft. Daddy Yankee", duration: "3:47", videoId: "kJQP7kiw5Fk", icon: "fa-music", color: "#FF4500" },
    { title: "Say You Won't Let Go - James Arthur", duration: "3:31", videoId: "0yJwC2_S3cY", icon: "fa-heart", color: "#32CD32" },
    { title: "Closer - The Chainsmokers ft. Halsey", duration: "4:04", videoId: "PT2_F0dQhKE", icon: "fa-music", color: "#6A5ACD" },
    { title: "Dance Monkey - Tones and I", duration: "3:29", videoId: "1yHh4d9MofA", icon: "fa-music", color: "#8B008B" },
    { title: "All of Me - John Legend", duration: "4:29", videoId: "450pB1Z00F8", icon: "fa-heart", color: "#FF6347" },
    { title: "Havana - Camila Cabello ft. Young Thug", duration: "3:37", videoId: "HCjNJDNzw8I", icon: "fa-music", color: "#FF7F50" },
    { title: "Better Now - Post Malone", duration: "3:51", videoId: "Rk5_WN9RMzU", icon: "fa-music", color: "#FF4500" },
    { title: "Can't Stop the Feeling! - Justin Timberlake", duration: "3:56", videoId: "ru0K8u5bXw0", icon: "fa-music", color: "#FFD700" },
    { title: "The Middle - Zedd, Maren Morris, Grey", duration: "3:02", videoId: "JYk0mJfDkDA", icon: "fa-music", color: "#9370DB" },
    { title: "Bad Guy - Billie Eilish", duration: "3:14", videoId: "DyDfgMOUjCI", icon: "fa-music", color: "#4B0082" },
    { title: "Sugar - Maroon 5", duration: "3:55", videoId: "09R8_2nJtjg", icon: "fa-heart", color: "#FF69B4" },
    { title: "Rise - Katy Perry", duration: "3:24", videoId: "kX6zT5iJQig", icon: "fa-music", color: "#FF6347" },
    { title: "I Will Always Love You - Whitney Houston", duration: "4:31", videoId: "D1bWj2F4P1E", icon: "fa-heart", color: "#6A5ACD" },
    { title: "My Heart Will Go On - Celine Dion", duration: "4:40", videoId: "JgQ2H_o3-xc", icon: "fa-heart", color: "#FF1493" },
    { title: "Hello - Adele", duration: "4:55", videoId: "YQHsXMglC9A", icon: "fa-heart", color: "#B22222" },
    { title: "I Will Always Love You - Whitney Houston", duration: "4:31", videoId: "k2C5TjS2P2I", icon: "fa-heart", color: "#FF69B4" },
    { title: "Dance Monkey - Tones and I", duration: "3:29", videoId: "q0nYYk0K6kk", icon: "fa-music", color: "#32CD32" },
    { title: "Stay with Me - Sam Smith", duration: "2:52", videoId: "p7L8hvz7F6A", icon: "fa-heart", color: "#FFD700" },
    { title: "Hotline Bling - Drake", duration: "4:17", videoId: "ux5YfA1Q0sk", icon: "fa-music", color: "#8A2BE2" },
    { title: "Uptown Funk - Mark Ronson ft. Bruno Mars", duration: "4:30", videoId: "OPf0Y6SXR6g", icon: "fa-music", color: "#FF6347" },
    { title: "The Middle - Zedd, Maren Morris, Grey", duration: "3:02", videoId: "UelDrZ1aFeY", icon: "fa-music", color: "#FF69B4" },
    { title: "Somebody That I Used to Know - Gotye", duration: "4:05", videoId: "8UVNT4wvIGY", icon: "fa-music", color: "#32CD32" },
    { title: "Blinding Lights - The Weeknd", duration: "3:20", videoId: "4NRXx6U8ABQ", icon: "fa-music", color: "#FFD700" },
    { title: "See You Again - Wiz Khalifa ft. Charlie Puth", duration: "3:49", videoId: "RgKAFK5djSk", icon: "fa-music", color: "#B22222" },
    { title: "Shape of You - Ed Sheeran", duration: "3:53", videoId: "JGwWNGJdvx8", icon: "fa-music", color: "#8A2BE2" },
    { title: "Chasing Cars - Snow Patrol", duration: "4:27", videoId: "gdn_bz5ka1Y", icon: "fa-music", color: "#FF4500" },
    { title: "Thinking of You - Katy Perry", duration: "4:07", videoId: "M1sWc8p_QZ8", icon: "fa-heart", color: "#FF69B4" },
    { title: "All of Me - John Legend", duration: "4:30", videoId: "450pX8lFO8E", icon: "fa-heart", color: "#FFD700" },
    { title: "I Want It That Way - Backstreet Boys", duration: "3:33", videoId: "4fndeDfaWCg", icon: "fa-music", color: "#6A5ACD" },
    { title: "Take Me to Church - Hozier", duration: "4:01", videoId: "PVjiKRfKp7I", icon: "fa-music", color: "#32CD32" },
    { title: "Perfect - Ed Sheeran", duration: "4:23", videoId: "2Vv-BfVoq4g", icon: "fa-heart", color: "#B22222" },
    { title: "Riptide - Vance Joy", duration: "3:24", videoId: "uD8u7D8uG1o", icon: "fa-music", color: "#FF6347" },
    { title: "Every Breath You Take - The Police", duration: "4:13", videoId: "3cQWkwm_jT8", icon: "fa-music", color: "#8A2BE2" },
    { title: "A Thousand Years - Christina Perri", duration: "4:42", videoId: "UV5H5jHq-bA", icon: "fa-heart", color: "#FFD700" },
    { title: "Can't Help Falling in Love - Elvis Presley", duration: "3:00", videoId: "vG6l4V5M1U0", icon: "fa-heart", color: "#FF6347" },
    { title: "Counting Stars - OneRepublic", duration: "4:17", videoId: "hY7m5jjJ9mI", icon: "fa-music", color: "#32CD32" },
    { title: "Radioactive - Imagine Dragons", duration: "3:06", videoId: "ktvTqknDobU", icon: "fa-music", color: "#FFD700" },
    { title: "The Scientist - Coldplay", duration: "5:09", videoId: "RB-RcX5D-7I", icon: "fa-music", color: "#B22222" },
    { title: "Love Me Like You Do - Ellie Goulding", duration: "4:10", videoId: "AJtDXIazrMo", icon: "fa-heart", color: "#8A2BE2" },
    { title: "Don't Let Me Down - The Chainsmokers ft. Daya", duration: "3:28", videoId: "YoF5fXxY8h0", icon: "fa-music", color: "#FF69B4" },
    { title: "Firework - Katy Perry", duration: "3:48", videoId: "QGJuMBdaqIw", icon: "fa-music", color: "#FF4500" },
    { title: "Stay - Rihanna ft. Mikky Ekko", duration: "4:00", videoId: "sI0Vftu2L4Y", icon: "fa-heart", color: "#32CD32" },
    { title: "Tears Dry on Their Own - Amy Winehouse", duration: "3:12", videoId: "0W54X24gX00", icon: "fa-music", color: "#6A5ACD" },
    { title: "Sugar - Maroon 5", duration: "3:55", videoId: "09R8_2nJtjg", icon: "fa-music", color: "#FFD700" },
    { title: "Nothing Breaks Like a Heart - Mark Ronson ft. Miley Cyrus", duration: "3:44", videoId: "QW1goZZ0nCA", icon: "fa-music", color: "#FF69B4" },
    { title: "Everything I Do (I Do It for You) - Bryan Adams", duration: "4:11", videoId: "ZFkTP6aD1Gg", icon: "fa-heart", color: "#B22222" },
    { title: "Demons - Imagine Dragons", duration: "2:57", videoId: "mWRsgZuwf_8", icon: "fa-music", color: "#32CD32" },
    { title: "Your Song - Elton John", duration: "4:01", videoId: "GzK1W4V2mGE", icon: "fa-heart", color: "#FFD700" },
    { title: "Here Comes the Sun - The Beatles", duration: "3:05", videoId: "KQetemT1sWc", icon: "fa-music", color: "#6A5ACD" },
    { title: "Someone Like You - Adele", duration: "4:45", videoId: "hLQl3WQQoQ0", icon: "fa-heart", color: "#FF4500" },
    { title: "Let Her Go - Passenger", duration: "4:12", videoId: "RBumgq5yVrA", icon: "fa-music", color: "#8A2BE2" },
    { title: "Bad Liar - Imagine Dragons", duration: "3:58", videoId: "N8iTA2Vg8Hg", icon: "fa-music", color: "#FF69B4" },
    { title: "Hello - Lionel Richie", duration: "4:05", videoId: "tKTFLZ9c8cU", icon: "fa-heart", color: "#FFD700" },
    { title: "Grenade - Bruno Mars", duration: "3:42", videoId: "SRvJ8j1FQvE", icon: "fa-heart", color: "#B22222" },
    { title: "Take A Bow - Rihanna", duration: "3:50", videoId: "i7xHShU-DFM", icon: "fa-music", color: "#32CD32" },
    { title: "Stand By Me - Ben E. King", duration: "2:57", videoId: "rY0WxgSXdEE", icon: "fa-heart", color: "#6A5ACD" },
    { title: "Rolling in the Deep - Adele", duration: "3:48", videoId: "rY0WxgSXdEE", icon: "fa-music", color: "#FF69B4" },
    { title: "Breathe Me - Sia", duration: "4:24", videoId: "s1Xh33I0DgA", icon: "fa-music", color: "#8A2BE2" },
    { title: "Someone You Loved - Lewis Capaldi", duration: "3:02", videoId: "E8D4n8INQ_Y", icon: "fa-heart", color: "#32CD32" },
    { title: "Lose Yourself - Eminem", duration: "5:20", videoId: "m0s8jHz4K44", icon: "fa-music", color: "#FF6347" },
    { title: "Chasing Cars - Snow Patrol", duration: "4:27", videoId: "gdn_bz5ka1Y", icon: "fa-music", color: "#6A5ACD" },
    { title: "No Tears Left to Cry - Ariana Grande", duration: "3:25", videoId: "iHnEZW8fK2s", icon: "fa-music", color: "#FFD700" },
    { title: "Love Story - Taylor Swift", duration: "3:55", videoId: "8xg3vE8Iu7c", icon: "fa-heart", color: "#B22222" },
    { title: "Just the Way You Are - Bruno Mars", duration: "3:40", videoId: "LjhCEhWiKXk", icon: "fa-heart", color: "#FF69B4" },
    { title: "Young and Beautiful - Lana Del Rey", duration: "4:27", videoId: "o2f1l_XkH24", icon: "fa-music", color: "#32CD32" },
    { title: "Better Now - Post Malone", duration: "3:50", videoId: "o85WPMke7cM", icon: "fa-music", color: "#6A5ACD" },
    { title: "Let It Go - Idina Menzel", duration: "3:44", videoId: "moSFlvxhi0w", icon: "fa-music", color: "#FFD700" },
    { title: "Hallelujah - Jeff Buckley", duration: "4:36", videoId: "YQzM2sczFbI", icon: "fa-heart", color: "#FF4500" },
    { title: "Shallow - Lady Gaga & Bradley Cooper", duration: "3:36", videoId: "bo_6bXv4cNQ", icon: "fa-heart", color: "#FF69B4" },
    { title: "Need You Now - Lady A", duration: "4:00", videoId: "s4ml2sB3G5U", icon: "fa-heart", color: "#32CD32" },
    { title: "I Don't Want to Miss a Thing - Aerosmith", duration: "4:20", videoId: "Jk4CqLgL6Bk", icon: "fa-heart", color: "#B22222" },
    { title: "Someone to You - BANNERS", duration: "3:23", videoId: "aPE4ge0UadM", icon: "fa-music", color: "#FFD700" },
    { title: "A Sky Full of Stars - Coldplay", duration: "4:28", videoId: "3tL9qUeZ9wE", icon: "fa-music", color: "#8A2BE2" },
    { title: "Say You Won't Let Go - James Arthur", duration: "3:31", videoId: "0s0C7OCwRWo", icon: "fa-heart", color: "#FF6347" },
    { title: "Dusk Till Dawn - Zayn ft. Sia", duration: "4:21", videoId: "wC1wYyJ6BKA", icon: "fa-music", color: "#32CD32" },
    { title: "Girls Like You - Maroon 5 ft. Cardi B", duration: "3:55", videoId: "nYh-n7EOtMA", icon: "fa-music", color: "#FFD700" },
    { title: "Perfect - Ed Sheeran", duration: "4:23", videoId: "2Vv-BfVoq4g", icon: "fa-heart", color: "#B22222" },
    { title: "On My Own - Les Misérables Cast", duration: "4:02", videoId: "T7dAdWUBHKg", icon: "fa-music", color: "#FF69B4" },
    { title: "Back to December - Taylor Swift", duration: "4:55", videoId: "U7c9q_5-QwE", icon: "fa-heart", color: "#FF6347" },
    { title: "All I Want - Kodaline", duration: "3:52", videoId: "I1H_G4bs3a8", icon: "fa-music", color: "#32CD32" },
    { title: "If I Ain't Got You - Alicia Keys", duration: "3:36", videoId: "Ju8n9SxHfy0", icon: "fa-heart", color: "#8A2BE2" },
    { title: "Apologize - OneRepublic", duration: "3:28", videoId: "ApWfUjFQeC0", icon: "fa-music", color: "#FF6347" },
    { title: "Stay With Me - Sam Smith", duration: "2:52", videoId: "wW6G0nNkeAk", icon: "fa-heart", color: "#FFD700" },
    { title: "Wherever You Will Go - The Calling", duration: "3:27", videoId: "0Sg2D4fZj_U", icon: "fa-music", color: "#B22222" },
    { title: "Don't Speak - No Doubt", duration: "4:24", videoId: "TPugNkJuhH0", icon: "fa-music", color: "#FF69B4" },
    { title: "Halo - Beyoncé", duration: "4:22", videoId: "bnVUHwcYNHs", icon: "fa-heart", color: "#32CD32" },
    { title: "I Will Always Love You - Whitney Houston", duration: "4:31", videoId: "D6nG0PCV5Vs", icon: "fa-heart", color: "#8A2BE2" },
    { title: "I Wanna Know What Love Is - Foreigner", duration: "4:55", videoId: "sGJ-Rz8fOVM", icon: "fa-heart", color: "#FF6347" },
    { title: "Rolling in the Deep - Adele", duration: "3:48", videoId: "rY0WxgSXdEE", icon: "fa-music", color: "#FFD700" },
    { title: "Say Something - A Great Big World ft. Christina Aguilera", duration: "3:48", videoId: "hDo-Jq49sRQ", icon: "fa-heart", color: "#B22222" },
    { title: "What Do You Mean? - Justin Bieber", duration: "3:25", videoId: "n8w7T5tS0Zk", icon: "fa-music", color: "#FF69B4" },
    { title: "Shape of You - Ed Sheeran", duration: "3:53", videoId: "JGwWNGJdvx8", icon: "fa-music", color: "#32CD32" },
    { title: "Fix You - Coldplay", duration: "4:55", videoId: "kXU9N0e_RlE", icon: "fa-heart", color: "#8A2BE2" },
    { title: "The A Team - Ed Sheeran", duration: "4:00", videoId: "s0ZlG9Lp7Y0", icon: "fa-music", color: "#FF6347" },
    { title: "We Found Love - Rihanna ft. Calvin Harris", duration: "3:35", videoId: "o_1uK-7Y4fY", icon: "fa-music", color: "#FFD700" },
    { title: "Take Me to Church - Hozier", duration: "4:01", videoId: "PVjiKR8z6RQ", icon: "fa-heart", color: "#B22222" },
    { title: "Perfect - Simple Plan", duration: "4:04", videoId: "jWgUuL_zfXg", icon: "fa-music", color: "#32CD32" },
    { title: "Believer - Imagine Dragons", duration: "3:24", videoId: "7wt8yJ_fM8U", icon: "fa-music", color: "#FF69B4" },
    { title: "Skyscraper - Demi Lovato", duration: "3:30", videoId: "yaDgptG5MZg", icon: "fa-heart", color: "#8A2BE2" },
    { title: "Bleeding Love - Leona Lewis", duration: "4:23", videoId: "2V60e-G8K_Q", icon: "fa-heart", color: "#FF6347" },
    { title: "Because You Loved Me - Celine Dion", duration: "4:34", videoId: "v9tsYgrW7W0", icon: "fa-heart", color: "#FFD700" },
    { title: "I Don't Care - Ed Sheeran & Justin Bieber", duration: "3:39", videoId: "x2lYg1lq1cM", icon: "fa-music", color: "#B22222" },
    { title: "Riptide - Vance Joy", duration: "3:24", videoId: "u8hZgSbNKX0", icon: "fa-music", color: "#32CD32" },
    { title: "Back to You - Selena Gomez", duration: "3:38", videoId: "2n_hBph82mU", icon: "fa-heart", color: "#8A2BE2" },
    { title: "Love Like There's No Tomorrow - The Script", duration: "3:51", videoId: "hvOvD_pj_nU", icon: "fa-heart", color: "#FF6347" },
    { title: "Ocean Eyes - Billie Eilish", duration: "3:20", videoId: "viK49uqS6tE", icon: "fa-music", color: "#FFD700" },
    { title: "It Will Rain - Bruno Mars", duration: "4:18", videoId: "S-ExWVEHtA0", icon: "fa-heart", color: "#32CD32" },
    { title: "The Way You Make Me Feel - Michael Jackson", duration: "4:58", videoId: "06Gkg9MfViA", icon: "fa-music", color: "#B22222" },
    { title: "Dreams - Fleetwood Mac", duration: "4:17", videoId: "mrqM2G8FFOA", icon: "fa-music", color: "#6A5ACD" },
    { title: "No One - Alicia Keys", duration: "4:16", videoId: "gb-3j6bo83A", icon: "fa-heart", color: "#FF69B4" },
    { title: "Rolling in the Deep - Adele", duration: "3:48", videoId: "rY0WxgSXdEE", icon: "fa-music", color: "#FF4500" },
    { title: "All of Me - John Legend", duration: "4:22", videoId: "450pP0zB1x4", icon: "fa-heart", color: "#32CD32" },
    { title: "Hurt - Christina Aguilera", duration: "4:00", videoId: "iYH_OjxYIg8", icon: "fa-heart", color: "#FFD700" },
    { title: "Irreplaceable - Beyoncé", duration: "3:47", videoId: "2mD-39XcOl0", icon: "fa-music", color: "#B22222" },
    { title: "Bubbly - Colbie Caillat", duration: "3:16", videoId: "N1e7C9tYjXE", icon: "fa-heart", color: "#FF69B4" },
    { title: "Complicated - Avril Lavigne", duration: "4:03", videoId: "K_a4t7IX2y8", icon: "fa-music", color: "#6A5ACD" },
    { title: "Tears Dry on Their Own - Amy Winehouse", duration: "3:06", videoId: "j2mgTgXoMAE", icon: "fa-heart", color: "#8A2BE2" },
    { title: "Bleed for You - Meiko", duration: "3:18", videoId: "6LALxN4ffpk", icon: "fa-music", color: "#FF6347" },
    { title: "Chasing Cars - Snow Patrol", duration: "4:27", videoId: "gdn_bz5ka1Y", icon: "fa-heart", color: "#32CD32" },
    { title: "All I Want - Kodaline", duration: "3:52", videoId: "I1H_G4bs3a8", icon: "fa-heart", color: "#B22222" },
    { title: "We Belong Together - Mariah Carey", duration: "3:24", videoId: "IJ41ZOd0X7c", icon: "fa-music", color: "#FFD700" },
    { title: "Stay - Rihanna ft. Mikky Ekko", duration: "4:00", videoId: "7J6lZgMvnJk", icon: "fa-heart", color: "#8A2BE2" },
    { title: "Hey There Delilah - Plain White T's", duration: "3:36", videoId: "2VfRXYn6g8E", icon: "fa-heart", color: "#FF69B4" },
    { title: "Gravity - John Mayer", duration: "4:00", videoId: "D5N9Ikw9sOQ", icon: "fa-music", color: "#FF4500" },
    { title: "Need You Now - Lady A", duration: "4:00", videoId: "s4ml2sB3G5U", icon: "fa-heart", color: "#32CD32" },
    { title: "What Makes You Beautiful - One Direction", duration: "3:18", videoId: "Q4C_0F1C-Fg", icon: "fa-music", color: "#B22222" },
    { title: "With or Without You - U2", duration: "4:56", videoId: "aEYHJZ3hTHg", icon: "fa-music", color: "#FFD700" },
    { title: "My Heart Will Go On - Celine Dion", duration: "4:40", videoId: "Jb0ofP_Lu1Y", icon: "fa-heart", color: "#8A2BE2" },
    { title: "Wrecking Ball - Miley Cyrus", duration: "3:41", videoId: "My2FRPA3g7I", icon: "fa-heart", color: "#FF6347" },
    { title: "Somebody That I Used to Know - Gotye", duration: "4:05", videoId: "8UVNT4wvIGY", icon: "fa-music", color: "#32CD32" },
    { title: "Someone Like You - Adele", duration: "4:45", videoId: "D4sXfakph6o", icon: "fa-heart", color: "#B22222" },
    { title: "What a Wonderful World - Louis Armstrong", duration: "2:20", videoId: "Wg5H04EGg0Y", icon: "fa-music", color: "#FFD700" },
    { title: "You Are the Reason - Calum Scott", duration: "3:27", videoId: "v4R7k7F_7d8", icon: "fa-heart", color: "#6A5ACD" },
    { title: "Unchained Melody - The Righteous Brothers", duration: "3:38", videoId: "F9t-3l3V4eM", icon: "fa-heart", color: "#FF69B4" },
    { title: "Say You Won't Let Go - James Arthur", duration: "3:31", videoId: "0s0C7OCwRWo", icon: "fa-music", color: "#FF6347" },
    { title: "Stand by Me - Ben E. King", duration: "2:56", videoId: "VtJfE2-u6fI", icon: "fa-heart", color: "#32CD32" },
    { title: "Dancing on My Own - Robyn", duration: "4:40", videoId: "48X9rS2Su7s", icon: "fa-music", color: "#B22222" },
    { title: "Hero - Enrique Iglesias", duration: "4:00", videoId: "cF8go7O5KpE", icon: "fa-heart", color: "#FFD700" },
    { title: "Falling - Harry Styles", duration: "4:00", videoId: "lP2XX8SUZ9c", icon: "fa-music", color: "#FF4500" },
    { title: "The Night We Met - Lord Huron", duration: "3:29", videoId: "GfqE7YBRI8g", icon: "fa-heart", color: "#6A5ACD" },
    { title: "Someone You Loved - Lewis Capaldi", duration: "3:02", videoId: "E8D4n8INQ_Y", icon: "fa-music", color: "#FF69B4" },
    { title: "Goodbye Yellow Brick Road - Elton John", duration: "3:13", videoId: "y1puT6cA_Aw", icon: "fa-music", color: "#32CD32" },
];

const trackList = document.createElement('div');
trackList.style.cssText = 'margin-bottom: 15px; max-height: 300px; overflow-y: auto;';

tracks.forEach((track, index) => {
    const trackRow = document.createElement('div');
    trackRow.classList.add('track-row');
    trackRow.dataset.trackIndex = index;
    trackRow.innerHTML = `
        <img src="https://img.youtube.com/vi/${track.videoId}/0.jpg" alt="${track.title}" style="width: 50px; height: 50px; border-radius: 8px; margin-right: 10px;">
        <div style="flex-grow: 1;">
            <span class="track-title">${track.title}</span>
            <span class="duration">${track.duration}</span>
        </div>
    `;

  // Add gradient background based on track color
trackRow.style.cssText = `
    background: linear-gradient(135deg, ${track.color}, #FFC300);
    color: #EAEAEA;
    border-radius: 12px; /* Smoother rounded edges */
    padding: 15px;
    margin: 8px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease; /* Smooth transitions */
    position: relative;
    overflow: hidden; /* For cool hover effects */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* Add depth with shadow */
`;

// Add hover effect with scale and glow
trackRow.addEventListener('mouseover', () => {
    trackRow.style.transform = 'scale(1.05)'; /* Slight enlarge effect */
    trackRow.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.4)'; /* More pronounced shadow */
    trackRow.style.background = `linear-gradient(135deg, ${track.color}, #FF5733)`; /* Change gradient on hover */
});

trackRow.addEventListener('mouseout', () => {
    trackRow.style.transform = 'scale(1)'; /* Reset scale */
    trackRow.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; /* Reset shadow */
    trackRow.style.background = `linear-gradient(135deg, ${track.color}, #FFC300)`; /* Reset gradient */
});

    // Hover effects
    trackRow.addEventListener('mouseenter', () => {
        trackRow.style.transform = 'scale(1.02)';
        trackRow.style.background = `${track.color}`; // Brighter color on hover
    });
    trackRow.addEventListener('mouseleave', () => {
        trackRow.style.transform = 'scale(1)';
        trackRow.style.background = `linear-gradient(135deg, ${track.color}, #FFC300)`;
    });

    trackRow.addEventListener('click', function() {
        playTrack(index);
    });

    trackList.appendChild(trackRow);
});
panel.appendChild(trackList);

 // Control Panel
const controls = document.createElement('div');
controls.style.cssText = `
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 15px;
    padding: 15px; /* Added extra padding for a more spacious layout */
    background: rgba(25, 25, 30, 0.8); /* Darker semi-transparent background */
    border-radius: 12px; /* Rounded edges for the panel */
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.6); /* Deeper shadow for better depth */
`;

// Function to create control buttons
const createButton = (id, icon) => {
    const button = document.createElement('button');
    button.id = id;
    button.className = 'control-btn';
    button.innerHTML = `<i class="fas ${icon}"></i>`;
    button.style.cssText = `
        background: transparent;
        border: none;
        color: #EAEAEA;
        font-size: 28px; /* Slightly larger font size */
        cursor: pointer;
        transition: transform 0.3s, color 0.3s, box-shadow 0.3s; /* Smoother transition */
    `;

    // Hover effect for buttons
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)'; // Slightly increase size on hover
        button.style.color = '#4A90E2'; // Change color on hover
        button.style.boxShadow = '0 0 15px rgba(74, 144, 226, 0.7)'; // Glow effect
    });
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)'; // Reset size
        button.style.color = '#EAEAEA'; // Reset color
        button.style.boxShadow = 'none'; // Reset shadow
    });

    return button;
};

// Create and append buttons
const prevButton = createButton('prev', 'fa-backward');
const playButton = createButton('play', 'fa-play');
const nextButton = createButton('next', 'fa-forward');
controls.appendChild(prevButton);
controls.appendChild(playButton);
controls.appendChild(nextButton);

// Seek Bar
const seekBar = document.createElement('input');
seekBar.type = 'range';
seekBar.id = 'seek-bar';
seekBar.value = '0';
seekBar.step = '1';
seekBar.min = '0';
seekBar.max = '100';
seekBar.style.cssText = `
    width: 100%;
    margin-top: 15px;
    border-radius: 8px;
    background: #3E3E52; /* Track color */
    -webkit-appearance: none; /* Remove default styling */
    height: 8px; /* Slightly taller track */
`;

// Custom styling for seek bar thumb
seekBar.style.setProperty('--thumb-color', '#FFDA44'); // CSS variable for thumb color
seekBar.style.setProperty('--track-color', '#4A90E2'); // CSS variable for track color

// Seek bar thumb styling
seekBar.style.cssText += `
    &::-webkit-slider-thumb {
        -webkit-appearance: none; /* Remove default thumb styling */
        appearance: none;
        width: 16px; /* Increased thumb width */
        height: 16px; /* Increased thumb height */
        border-radius: 50%; /* Round thumb */
        background: var(--thumb-color); /* Use custom thumb color */
        cursor: pointer; /* Pointer cursor */
        transition: background 0.3s; /* Smooth transition for color change */
    }
    &::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--thumb-color);
        cursor: pointer;
        transition: background 0.3s;
    }
`;

// Append elements to the panel
panel.appendChild(controls);
panel.appendChild(seekBar);

// Append the panel to the body
document.body.appendChild(panel);


 // Mini Panel
const miniPanel = document.createElement('div');
miniPanel.id = 'mini-panel';
miniPanel.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 320px; /* Slightly wider for balance */
    background: linear-gradient(135deg, #2E2E2E, #3E3E3E); /* Smooth gray gradient */
    color: #E0E0E0; /* Softer, more refined text color */
    border-radius: 16px; /* Rounded corners for a modern look */
    padding: 20px; /* Increased padding for spacious feel */
    display: none;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5); /* Softer shadow */
    transition: all 0.4s ease-in-out; /* Smooth transition */
    font-family: 'Poppins', sans-serif; /* Cleaner, modern font */
    z-index: 900; /* Ensures lower positioning */
`;

// Mini Panel Content
miniPanel.innerHTML = `
    <div style="padding: 15px; background: rgba(40, 40, 40, 0.85); border-radius: 12px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);">
        <strong style="font-size: 18px; color: #FFD700;">Now Playing:</strong>
        <span id="mini-currently-playing" style="color: #EAEAEA;">None</span><br>
        <img id="mini-thumbnail" src="" alt="Thumbnail" style="width: 80px; height: 80px; border-radius: 12px; margin-top: 10px; transition: transform 0.3s ease-in-out, box-shadow 0.3s;">
        <div style="display: flex; justify-content: space-around; margin-top: 20px;">
            <button id="mini-prev" class="mini-control-btn" style="background: transparent; border: none; color: #FFD700; cursor: pointer; transition: color 0.3s, transform 0.3s;">
                <i class="fas fa-backward"></i>
            </button>
            <button id="mini-play" class="mini-control-btn" style="background: transparent; border: none; color: #FFD700; cursor: pointer; transition: color 0.3s, transform 0.3s;">
                <i class="fas fa-play"></i>
            </button>
            <button id="mini-next" class="mini-control-btn" style="background: transparent; border: none; color: #FFD700; cursor: pointer; transition: color 0.3s, transform 0.3s;">
                <i class="fas fa-forward"></i>
            </button>
        </div>
    </div>
`;

// Add hover effects to buttons
const buttons = miniPanel.querySelectorAll('.mini-control-btn');
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.color = '#FFDA44'; // Change color on hover
        button.style.transform = 'scale(1.1)'; // Slightly increase size on hover
    });
    button.addEventListener('mouseleave', () => {
        button.style.color = '#EAEAEA'; // Revert color
        button.style.transform = 'scale(1)'; // Revert size
    });
});
    // Thumbnail hover effect
const thumbnail = miniPanel.querySelector('#mini-thumbnail');
thumbnail.addEventListener('mouseenter', () => {
    thumbnail.style.transform = 'scale(1.05)'; /* Thumbnail enlarges slightly */
    thumbnail.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.8)'; /* Shadow deepens */
});
thumbnail.addEventListener('mouseleave', () => {
    thumbnail.style.transform = 'scale(1)'; /* Returns to normal size */
    thumbnail.style.boxShadow = 'none'; /* Removes shadow */
});

// Append the mini panel to the body
document.body.appendChild(miniPanel);


   // Expandable/Collapsible toggle button
const toggleButton = document.createElement('button');
toggleButton.innerHTML = '<i class="fas fa-music"></i>';
toggleButton.style.cssText = `
    position: fixed;
    bottom: 30px; /* Slightly raised for better visibility */
    right: 30px;
    width: 70px; /* Slightly larger for emphasis */
    height: 70px;
    background: linear-gradient(135deg, #4A90E2, #50C9C3); /* Cool gradient */
    color: white;
    border: none;
    border-radius: 50%; /* Circular shape */
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5); /* Deeper shadow for more depth */
    font-size: 28px; /* Larger icon size */
    cursor: pointer;
    transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    outline: none;
    z-index: 1000;

    /* Add hover effects for interaction feedback */
    &:hover {
        background: linear-gradient(135deg, #50C9C3, #4A90E2); /* Reverse gradient on hover */
        transform: scale(1.1); /* Slightly enlarge on hover */
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6); /* Larger shadow on hover */
    }

    /* Add active state for a press effect */
    &:active {
        transform: scale(0.95); /* Slight shrink on click */
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4); /* Smaller shadow on click */
    }
`;

// Append button to the body
document.body.appendChild(toggleButton);

// Hover effects for toggle button
toggleButton.addEventListener('mouseenter', () => {
    toggleButton.style.backgroundColor = '#357ABD'; // Darker shade on hover
    toggleButton.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.5)'; // Enhanced shadow
});
toggleButton.addEventListener('mouseleave', () => {
    toggleButton.style.backgroundColor = '#4A90E2'; // Original color
    toggleButton.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4)'; // Original shadow
});

// Toggle panel visibility
toggleButton.addEventListener('click', function() {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    toggleButton.style.transform = panel.style.display === 'block' ? 'rotate(90deg)' : 'rotate(0deg)';
    toggleButton.style.backgroundColor = panel.style.display === 'block' ? '#5DADE2' : '#4A90E2'; // Change color based on state
});

// Append the button to the body
document.body.appendChild(toggleButton);

    // Initialize YouTube Player
    let player;
    let currentTrackIndex = -1;
    let updateSeekBarInterval;

    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('yt-player', {
            height: '0',
            width: '0',
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };

    // Hide the YouTube iframe (audio-only)
    const youtubePlayer = document.createElement('div');
    youtubePlayer.id = 'yt-player';
    youtubePlayer.style.display = 'none';
    document.body.appendChild(youtubePlayer);

    function onPlayerReady(event) {
        // Player is ready
    }

    function onPlayerStateChange(event) {
        // Track state change
        if (event.data === YT.PlayerState.ENDED) {
            nextTrack();
        }
    }

    // Play/Pause functionality
    playButton.addEventListener('click', function() {
        const state = player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            player.pauseVideo();
            this.innerHTML = '<i class="fas fa-play"></i>';
            document.getElementById('mini-play').innerHTML = '<i class="fas fa-play"></i>';
        } else {
            player.playVideo();
            this.innerHTML = '<i class="fas fa-pause"></i>';
            document.getElementById('mini-play').innerHTML = '<i class="fas fa-pause"></i>';
        }
    });

    prevButton.addEventListener('click', function() {
        prevTrack();
    });

    nextButton.addEventListener('click', function() {
        nextTrack();
    });

    function playTrack(index) {
        if (currentTrackIndex !== -1) {
            player.stopVideo();
        }
        currentTrackIndex = index;
        const track = tracks[currentTrackIndex];
        player.loadVideoById(track.videoId);
        document.getElementById('currently-playing').innerText = track.title;
        document.getElementById('mini-currently-playing').innerText = track.title;
        document.getElementById('mini-thumbnail').src = `https://img.youtube.com/vi/${track.videoId}/0.jpg`; // Thumbnail update
        updateSeekBar();
        updateMiniPanel();
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        document.getElementById('mini-play').innerHTML = '<i class="fas fa-pause"></i>';
    }

    function nextTrack() {
        if (currentTrackIndex < tracks.length - 1) {
            playTrack(currentTrackIndex + 1);
        }
    }

    function prevTrack() {
        if (currentTrackIndex > 0) {
            playTrack(currentTrackIndex - 1);
        }
    }

    function updateSeekBar() {
        updateSeekBarInterval = setInterval(() => {
            const currentTime = player.getCurrentTime();
            const duration = player.getDuration();
            if (duration) {
                const seekBar = document.getElementById('seek-bar');
                seekBar.value = (currentTime / duration) * 100;
            }
        }, 1000);
    }

    function updateMiniPanel() {
        if (currentTrackIndex !== -1) {
            miniPanel.style.display = 'block';
            document.getElementById('mini-currently-playing').innerText = tracks[currentTrackIndex].title;
            document.getElementById('mini-thumbnail').src = `https://img.youtube.com/vi/${tracks[currentTrackIndex].videoId}/0.jpg`; // Update thumbnail
        }
    }

    // Mini panel button functionality
    const miniPlayButton = document.getElementById('mini-play');
    miniPlayButton.addEventListener('click', function() {
        const state = player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            player.pauseVideo();
            this.innerHTML = '<i class="fas fa-play"></i>';
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            player.playVideo();
            this.innerHTML = '<i class="fas fa-pause"></i>';
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
        }
    });

    document.getElementById('mini-prev').addEventListener('click', function() {
        prevTrack();
    });

    document.getElementById('mini-next').addEventListener('click', function() {
        nextTrack();
    });

    // Add CSS styles for the new features
    const css = document.createElement('style');
    css.textContent = `
       .control-btn, .mini-control-btn {
    background: #4A90E2; /* Base color for buttons */
    color: white; /* Text color */
    border: none; /* No border */
    border-radius: 8px; /* Rounded edges */
    padding: 10px 15px; /* Internal padding */
    cursor: pointer; /* Pointer on hover */
    transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth color transition */
    font-size: 18px; /* Font size */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow for depth */
}

.control-btn:hover, .mini-control-btn:hover {
    background-color: #357ABD; /* Darker shade on hover */
    transform: translateY(-2px); /* Slightly lift the button */
}

.control-btn:focus, .mini-control-btn:focus {
    outline: none; /* Remove default outline */
    box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.6); /* Focus ring */
}

#seek-bar {
    border-radius: 8px; /* Rounded edges */
    margin-top: 10px; /* Space above the seek bar */
    background: #3E3E52; /* Background color */
    height: 8px; /* Height of the seek bar */
    cursor: pointer; /* Pointer on hover */
}

#seek-bar::-webkit-slider-thumb {
    -webkit-appearance: none; /* Remove default styling */
    appearance: none; /* Remove default styling */
    width: 16px; /* Thumb width */
    height: 16px; /* Thumb height */
    background: #FFDA44; /* Thumb color */
    border-radius: 50%; /* Round shape */
    cursor: pointer; /* Pointer on hover */
}

#seek-bar::-moz-range-thumb {
    width: 16px; /* Thumb width */
    height: 16px; /* Thumb height */
    background: #FFDA44; /* Thumb color */
    border-radius: 50%; /* Round shape */
    cursor: pointer; /* Pointer on hover */
}

.track-row {
    display: flex; /* Flexbox for alignment */
    justify-content: flex-start; /* Align items to the left */
    align-items: center; /* Center items vertically */
    padding: 10px; /* Internal padding */
    border-radius: 8px; /* Rounded edges */
    margin: 5px 0; /* Vertical spacing between rows */
    cursor: pointer; /* Pointer on hover */
    transition: background 0.3s, transform 0.3s; /* Smooth transitions */
}

.track-row:hover {
    background: rgba(255, 255, 255, 0.1); /* Light background on hover */
    transform: scale(1.02); /* Slightly enlarge */
}
    `;
    document.head.appendChild(css);
})();
