// ==UserScript==
// @name         macOS-like Custom Start Page Full Version
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  A full version macOS-like start page with weather, to-do persistence, voice search, and responsive design
// @author       文熙
// @license      MIT
// @match        *://*/blank.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512229/macOS-like%20Custom%20Start%20Page%20Full%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/512229/macOS-like%20Custom%20Start%20Page%20Full%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to detect if it's mobile
    function isMobile() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }

    // Define custom HTML for macOS-style start page with advanced features
    const startPageHtml = `
        <div class="container">
            <div class="widget glass">
                <h1 class="title">Good Day</h1>
                <div class="time-widget" id="currentTime">--:--:--</div>
                <div class="search-section">
                    <input type="text" id="searchBar" class="search-bar" placeholder="Search the web..." />
                    <button id="voiceSearch" class="voice-search" title="Voice Search"><img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Microphone_Icon.svg" alt="Voice Search" width="24" height="24"></button>
                </div>
                <select id="searchEngine" class="search-engine">
                    <option value="https://www.google.com/search?q=">Google</option>
                    <option value="https://www.bing.com/search?q=">Bing</option>
                    <option value="https://duckduckgo.com/?q=">DuckDuckGo</option>
                </select>
            </div>
            <div class="dock">
                <a href="https://www.google.com" target="_blank" class="dock-icon"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" width="48" height="48"></a>
                <a href="https://www.github.com" target="_blank" class="dock-icon"><img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" width="48" height="48"></a>
                <a href="https://www.reddit.com" target="_blank" class="dock-icon"><img src="https://upload.wikimedia.org/wikipedia/en/8/82/Reddit_logo_and_wordmark.svg" alt="Reddit" width="48" height="48"></a>
            </div>
            <div class="widgets-container">
                <div class="calendar-widget glass">
                    <div id="currentDate">--/--/----</div>
                </div>
                <div class="weather-widget glass">
                    <h2 class="weather-title">Weather</h2>
                    <div id="weatherInfo">Loading...</div>
                </div>
                <div class="todo-widget glass">
                    <h2 class="todo-title">To-Do List</h2>
                    <ul id="todoList" class="todo-list"></ul>
                    <input type="text" id="todoInput" class="todo-input" placeholder="Add a new task..." />
                    <button id="clearTodos" class="clear-button">Clear All</button>
                </div>
            </div>
            <div class="settings glass">
                <button id="themeButton" class="theme-button">Change Theme</button>
            </div>
        </div>
    `;

    // Inject the HTML into the body
    document.body.innerHTML = startPageHtml;
    document.title = "macOS-like Start Page";

    // Function to update the current time every second
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        document.getElementById('currentTime').textContent = `${hours}:${minutes}:${seconds}`;
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Function to update the current date
    function updateDate() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        document.getElementById('currentDate').textContent = `${day}/${month}/${year}`;
    }
    updateDate();

    // Search bar functionality with engine selection
    const searchBar = document.getElementById('searchBar');
    const searchEngine = document.getElementById('searchEngine');
    searchBar.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = searchBar.value.trim();
            if (query) {
                const engineUrl = searchEngine.value;
                window.location.href = `${engineUrl}${encodeURIComponent(query)}`;
            }
        }
    });

    // Voice Search functionality
    const voiceSearchButton = document.getElementById('voiceSearch');
    voiceSearchButton.addEventListener('click', function() {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();
        recognition.onresult = function(event) {
            const query = event.results[0][0].transcript;
            searchBar.value = query;
            const engineUrl = searchEngine.value;
            window.location.href = `${engineUrl}${encodeURIComponent(query)}`;
        };
    });

    // To-Do List functionality with persistence
    const todoInput = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');
    const clearTodosButton = document.getElementById('clearTodos');

    // Load saved tasks from localStorage
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    savedTodos.forEach(task => {
        const listItem = createTodoItem(task);
        todoList.appendChild(listItem);
    });

    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const task = todoInput.value.trim();
            if (task) {
                const listItem = createTodoItem(task);
                todoList.appendChild(listItem);
                saveTodoItem(task);
                todoInput.value = ''; // Clear input after adding task
            }
        }
    });

    clearTodosButton.addEventListener('click', function() {
        todoList.innerHTML = '';
        localStorage.removeItem('todos');
    });

    function createTodoItem(task) {
        const listItem = document.createElement('li');
        listItem.textContent = task;
        listItem.addEventListener('click', () => {
            listItem.remove();
            removeTodoItem(task);
        });
        return listItem;
    }

    function saveTodoItem(task) {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.push(task);
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function removeTodoItem(task) {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        const updatedTodos = todos.filter(t => t !== task);
        localStorage.setItem('todos', JSON.stringify(updatedTodos));
    }

    // Weather Widget
    async function fetchWeather() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const apiKey = 'YOUR_OPENWEATHER_API_KEY'; // Replace with your API key
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
                const response = await fetch(weatherUrl);
                const data = await response.json();
                const weatherInfo = `${data.weather[0].description}, ${data.main.temp}°C`;
                document.getElementById('weatherInfo').textContent = weatherInfo;
            });
        } else {
            document.getElementById('weatherInfo').textContent = 'Geolocation not supported';
        }
    }
    fetchWeather();

    // Theme toggle button
    const themeButton = document.getElementById('themeButton');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', currentTheme === 'dark');
    themeButton.textContent = currentTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';

    themeButton.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeButton.textContent = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    });

    // Additional custom styles
    const customCss = `
        body {
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #f0f0f5, #d0d0e5);
            font-family: -apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            transition: background-color 0.5s;
        }
        body.dark-theme {
            background-color: #2c2c2c;
            color: #ffffff;
        }
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 90%;
            max-width: 1200px;
        }
        .widget, .glass {
            text-align: center;
            background: rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(10px);
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
            width: 100%;
        }
        .title {
            font-size: 2.5rem;
            color: #333;
            margin-bottom: 1rem;
        }
        .time-widget {
            font-size: 2rem;
            color: #555;
            margin-bottom: 1rem;
        }
        .search-bar {
            width: 80%;
            padding: 0.75rem;
            font-size: 1.2rem;
            border: none;
            border-radius: 20px;
            outline: none;
            text-align: center;
            background-color: rgba(255, 255, 255, 0.7);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease, box-shadow 0.3s ease;
            margin-bottom: 1rem;
        }
        .search-bar:focus {
            background-color: rgba(255, 255, 255, 0.9);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .voice-search {
            font-size: 1.5rem;
            background-color: #007aff;
            color: #fff;
            border: none;
            border-radius: 50%;
            padding: 0.5rem;
            cursor: pointer;
            margin-bottom: 1rem;
        }
        .search-engine {
            padding: 0.5rem;
            border: none;
            border-radius: 10px;
            margin-bottom: 2rem;
        }
        .dock {
            display: flex;
            justify-content: center;
            gap: 2rem;
        }
        .dock-icon {
            font-size: 1.2rem;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.6);
            padding: 0.75rem 1.5rem;
            border-radius: 15px;
            text-decoration: none;
            transition: background-color 0.3s ease, transform 0.3s ease;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        .dock-icon:hover {
            background-color: rgba(0, 0, 0, 0.8);
            transform: translateY(-5px);
        }
        .widgets-container {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            gap: 2rem;
            width: 100%;
        }
        .calendar-widget, .weather-widget, .todo-widget {
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .calendar-widget #currentDate {
            font-size: 1.5rem;
            color: #333;
        }
        .weather-title, .todo-title {
            font-size: 1.5rem;
            color: #333;
            margin-bottom: 1rem;
        }
        .todo-list {
            list-style: none;
            padding: 0;
        }
        .todo-list li {
            background-color: rgba(0, 0, 0, 0.05);
            padding: 0.5rem 1rem;
            border-radius: 10px;
            margin-bottom: 0.5rem;
            cursor: pointer;
        }
        .todo-list li:hover {
            background-color: rgba(0, 0, 0, 0.1);
        }
        .theme-button {
            padding: 0.75rem 1.5rem;
            background-color: #007aff;
            color: #fff;
            border: none;
            border-radius: 10px;
            cursor: pointer;
        }
    `;

    // Inject the custom CSS into the page
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = customCss;
    document.head.appendChild(styleSheet);

})();