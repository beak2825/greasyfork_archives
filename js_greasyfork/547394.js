async function main() {
    await init_gm_config();
    await wait_for_gm_config();

    if(GM_config.get("script_enabled")) {
        const custom_css = GM_config.get("custom_css_styles")?.trim();
        if (custom_css)
            GM_addStyle(custom_css);

        if(GM_config.get("hide_powerups"))
            hide_powerups();

        if(GM_config.get("collect_point_bonus"))
            collect_point_bonus();

        wait_for_element(".chat-input").then(async () => {
            if(GM_config.get("irc"))
                if(GM_config.get("auth_username") != "" && GM_config.get("auth_oauth") != "")
                    connect_to_twitch();
                else
                    Swal.fire({
                        title: "Missing IRC Credentials!",
                        text: "IRC is selected, but your username or OAuth token is missing or invalid. Please update your settings or disable \"Use IRC\".",
                        icon: "error",
                        theme: "dark",
                        backdrop: false
                    });

            if(GM_config.get("notifications"))
                observe_chat_for_username_mentions();

            wait_for_element(".community-points-summary").then(async () => {
                if(GM_config.get("voucher_buttons"))
                    generate_voucher_buttons();
            });

            if(GM_config.get("show_streamelements_points"))
                show_streamelements_points();

            insert_command_buttons(generate_button_groups());
        });
    }
}

// ========================
// Username
// ========================

let username = get_username_from_cookie();

function get_username_from_cookie() {
    // Get all cookies
    const cookies = document.cookie.split(";");
    // Search for the "name" cookie
    for (const cookie of cookies) {
        const [cookie_name, cookie_value] = cookie.trim().split("=");
        if (cookie_name === "name")
            return decodeURIComponent(cookie_value); // URL-decode the value
    }
    return null; // "name" cookie not found
}

// ========================
// StreamElements Functions & API
// ========================

let se_channel = null; // Variable to store the channel data
let se_user_data = null; // Variable to store user-specific data

let se_user_data_fetch_interval = 1; // In minutes
let se_points_add_delay = 5; // In seconds
let element_se_current = null;
let element_se_change = null;

async function show_streamelements_points() {
    // Wait for the channel data to be fetched
    await streamelements_fetch_channel_data(streamelements_store);
    // Check if the channel data was successfully fetched
    if (!se_channel)
        return console.error("Channel data could not be fetched.");

    if(username)
    {
        wait_for_element(".k-streamelements_points").then(async () => {
            // Initialize the innerHTML with two spans
            document.querySelector(".k-streamelements_points").innerHTML = `
            StreamElements: <span id="k-se_current_span"></span><span id="k-se_change_span"></span>
        `;

            // Point to the <span> elements
            element_se_current = document.querySelector("#k-se_current_span");
            element_se_change = document.querySelector("#k-se_change_span");

            await update_se_points(true); // Initial update of points
            setInterval(update_se_points, se_user_data_fetch_interval * 60 * 1000);
        });
    }
}

async function update_se_points(initialization = false) {
    // Get current points from the data attribute
    const data_points = element_se_current.getAttribute("data-points");
    const current = data_points !== null ? parseInt(data_points) : null;

    const user_data = await streamelements_fetch_user(se_channel._id, username);
    const new_points = user_data?.points ?? null;

    if (new_points === null) {
        element_se_current.textContent = "N/A";
        element_se_current.setAttribute("data-points", null);
        element_se_change.textContent = ""; // Clear the change span
        return;
    }

    element_se_current.setAttribute("data-points", new_points);
    const diff = new_points - current;

    if (diff !== 0 && !initialization) {
        // Add class to the change span based on whether the difference is positive or negative
        if (diff > 0)
            element_se_change.classList.add("k-points_added");
        else
            element_se_change.classList.add("k-points_subtracted");

        // Show the old points in the current span and the difference in the change span
        element_se_current.textContent = current;
        element_se_change.textContent = ` ${diff >= 0 ? "+" : ""}${diff}`;
        await sleep_s(10);

        // Use the generic animation method
        element_se_change.textContent = "";
        await animate_number_counter(element_se_current, current, new_points);

        // Remove the class after the animation
        element_se_change.classList.remove("k-points_added", "k-points_subtracted");
    } else
        element_se_current.textContent = new_points;
}

async function streamelements_fetch_channel_data(twitch_channel) {
    try {
        const response = await fetch(`https://api.streamelements.com/kappa/v2/channels/${twitch_channel}`);
        if (!response.ok)
            throw new Error(`API request failed with status ${response.status}`);

        const data = await response.json();
        se_channel = data; // Store the entire JSON response
    } catch (error) {
        console.error("Error fetching StreamElements channel data:", error);
        se_channel = null; // Set to null in case of an error
    }
}

async function streamelements_fetch_user(channel_id, username) {
    try {
        const response = await fetch(`https://api.streamelements.com/kappa/v2/points/${channel_id}/${username}`);
        if (!response.ok)
            throw new Error(`API request failed with status ${response.status}`);

        const data = await response.json();
        return data || null; // Return the points or 0 if not found
    } catch (error) {
        console.error("Error fetching StreamElements points:", error);
        return null; // Return null in case of an error
    }
}

// ========================
// Twitch React Chat by Cyb3rgamer
// ========================

let current_chat;

function send_message_with_event(message) {
    // Update current_chat only if it's undefined or missing the onSendMessage prop
    if (!current_chat || !current_chat.props?.onSendMessage)
        current_chat = get_current_chat();

    // Send the message if current_chat and onSendMessage are available
    if (current_chat?.props?.onSendMessage)
        current_chat.props.onSendMessage(message);
    else
        console.error("Current chat is not available or missing onSendMessage prop.");
}

function get_current_chat() {
    try {
        const chat_node = document.querySelector(`section[data-test-selector="chat-room-component-layout"]`);
        if (!chat_node) return null;

        // Find the React instance of the chat container
        const react_instance = get_react_instance(chat_node);
        if (!react_instance) return null;

        // Search the React parent nodes for the chat component
        const chat_component = search_react_parents(react_instance, (node) => {
            return node.stateNode && node.stateNode.props && node.stateNode.props.onSendMessage;
        });

        return chat_component ? chat_component.stateNode : null;
    } catch (error) {
        console.error("Error accessing the chat:", error);
        return null;
    }
}

function get_react_instance(element) {
    for (const key in element)
        if (key.startsWith("__reactInternalInstance$") || key.startsWith("__reactFiber$"))
            return element[key];
    return null;
}

function search_react_parents(node, predicate, max_depth = 15, depth = 0) {
    if (!node || depth > max_depth) return null;

    try {
        if (predicate(node))
            return node;
    } catch (error) {
        console.error("Error while searching React parents:", error);
    }

    return search_react_parents(node.return, predicate, max_depth, depth + 1);
}

// ========================
// Twitch IRC Connection
// ========================

const twitch_host = "irc-ws.chat.twitch.tv";
const twitch_port = 443;
let socket;
let timer;
let reconnect_interval = 5000;

let reconnect_attempts = 0; // Counter for reconnection attempts
const max_reconnect_attempts = 3; // Maximum number of reconnection attempts

function connect_to_twitch() {
    socket = new WebSocket(`wss://${twitch_host}:${twitch_port}`);

    socket.onopen = () => {
        console.log("Twitch connection started.");

        // Authenticate and join the channel
        socket.send(`PASS ${GM_config.get("auth_oauth").includes("oauth:") ? GM_config.get("auth_oauth") : "oauth:" + GM_config.get("auth_oauth")}`);
        socket.send(`NICK ${GM_config.get("auth_username")}`);
        socket.send(`JOIN #${twitch_channel}`);

        // Start ping timer to prevent disconnect
        timer = setInterval(() => {
            socket.send("PING :tmi.twitch.tv");
        }, 5 * 60 * 1000); // Send a ping every 5 minutes
    };

    socket.onmessage = (event) => {
        const message = event.data;

        // Check for authentication failure
        if (message.includes("Login authentication failed")) {
            console.error("Twitch authentication failed. Please check your username and OAuth token.");
            reconnect_attempts++; // Increment the reconnection attempt counter
            console.log(`Authentication failed. Attempt ${reconnect_attempts} of ${max_reconnect_attempts}`);
            // Close the connection and try to reconnect
            socket.close();
            return;
        }
        else if (message.includes("Welcome, GLHF!")) { // Check for successful connection
            console.log("Twitch authentication successful.");
            reconnect_attempts = 0; // Reset the counter on successful authentication
        }
    };

    socket.onclose = () => {
        console.log("Twitch connection closed.");
        // Stop the ping timer
        clearInterval(timer);
        // Check if max reconnection attempts have been reached
        if (reconnect_attempts < max_reconnect_attempts) {
            reconnect_attempts++; // Increment the reconnection attempt counter
            console.log(`Reconnecting... Attempt ${reconnect_attempts} of ${max_reconnect_attempts}`);

            // Try to reconnect after a delay
            setTimeout(() => connect_to_twitch(), reconnect_interval);
        } else
            // Show error message if max reconnection attempts are reached
            Swal.fire({
                title: "Cannot connect to IRC!",
                text: "Unable to connect to Twitch with the provided credentials. Please check your username and OAuth token, or disable \"Use IRC\".",
                icon: "error",
                theme: "dark",
                backdrop: false
            });
    };

    socket.onerror = (error) => {
        console.error("Twitch connection error:", error);
    };
}

function send_message_with_irc(message) {
    if (socket.readyState === WebSocket.OPEN)
        socket.send(`PRIVMSG #${twitch_channel} :${message}`);
    else
        console.error("WebSocket is not open. Current state:", socket.readyState);
}

// ========================
// UI and Button Handling
// ========================

function insert_command_buttons(buttongroups) {
    let html = `
        <div id="k-main-container" class="k-main-container">
            <div id="k-streamelements_points" class="k-streamelements_points"></div>
            <div id="k-panel-buttons">
                <div id="k-make-draggable-button" title="Detach from chat">👆</div>
                <div id="k-grab-handle" class="k-hidden">🖐️</div>
                <div id="k-pin-button" class="k-hidden" title="Reattach to chat">📌</div>
                <div id="k-cart-button" title="Open store">🛒</div>
                <div id="k-open-settings" title="Userscript settings">⚙️</div>
            </div>
            <div id="k-actions" class="k-buttongroups">${buttongroups}</div>
        </div>
    `;
    document.querySelector(".chat-input").insertAdjacentHTML("beforebegin", html);

    // Add event listeners for buttons
    document.querySelector("#k-targets #k-closebutton")?.addEventListener("click", () => switch_panel(null), false);
    document.querySelectorAll(".k-buttongroup .k-actionbutton")?.forEach(el => el.addEventListener("click", generate_command, false));
    document.querySelectorAll(".k-buttongroup .k-targetbutton")?.forEach(el => el.addEventListener("click", switch_panel, false));
    document.querySelectorAll(".k-selection-label")?.forEach(el => el.addEventListener("click", show_btn_menu, false));

    // Draggable buttons
    document.querySelector("#k-make-draggable-button")?.addEventListener("mousedown", () => make_draggable());
    document.querySelector("#k-pin-button")?.addEventListener("click", () => disable_draggable());
    document.querySelector("#k-cart-button")?.addEventListener("click", () => open_store());
    document.querySelector("#k-open-settings")?.addEventListener("click", () => GM_config.open());
}

function open_store() {
    const store_name = streamelements_store?.trim() || twitch_channel;
    const url = `https://streamelements.com/${store_name}/store`;
    window.open(url, "_blank");
}

function switch_panel(event) {
    document.querySelector("#k-actions").classList.toggle("k-hidden");
    document.querySelector("#k-targets").classList.toggle("k-hidden");

    if (event) {
        const target_count = parseInt(event.target.getAttribute("data-targets"));
        const action = event.target.getAttribute("cmd");
        const target_buttons_container = document.getElementById("k-targetbuttons");

        // Set the data-action attribute for the targets panel
        document.querySelector("#k-targets").setAttribute("data-action", action);

        // Check if the number of existing buttons matches the target count
        const existing_buttons = target_buttons_container.querySelectorAll(".k-actionbutton");
        if (existing_buttons.length !== target_count) {
            // Clear existing buttons if the count doesn't match
            existing_buttons.forEach(button => button.remove());

            // Generate new buttons
            let target_buttons_html = "";
            for (let i = 1; i <= target_count; i++)
                target_buttons_html += btngrp_button(i, i);

            // Insert new buttons before the close button
            target_buttons_container.insertAdjacentHTML("afterbegin", target_buttons_html);

            // Add event listeners to the new buttons
            target_buttons_container.querySelectorAll(".k-actionbutton").forEach(el => {
                el.addEventListener("click", generate_command, false);
            });
        }

        // Adjust CSS for grid layout
        target_buttons_container.classList.remove("k-grid-1", "k-grid-2", "k-grid-3", "k-grid-4", "k-grid-5", "k-grid-6", "k-grid-7", "k-grid-8");

        // Calculate the number of buttons per row
        let buttons_per_row;
        if (target_count <= 6)
            buttons_per_row = target_count; // 1-6 Buttons: All in one row
        else if (target_count === 8)
            buttons_per_row = 4; // 8 Buttons: 4 per row
        else
            buttons_per_row = 6; // 7+ Buttons: 6 per row (except 8)

        target_buttons_container.classList.add(`k-grid-${buttons_per_row}`);
    }
}

function generate_command(event) {
    let cmd = "";
    if(event.target.parentNode.parentNode.getAttribute("data-action")) {
        cmd = event.target.parentNode.parentNode.getAttribute("data-action"); // Add action attack or devine in case its from the switched panel
        // Remove the data and go back to main panel
        event.target.parentNode.parentNode.setAttribute("data-action", "");
        switch_panel(null);
    }
    cmd += event.target.getAttribute("cmd");

    // Check if the button has random min and max attributes and append a random number if they exist
    if (event.target.hasAttribute("data-random-min") && event.target.hasAttribute("data-random-max"))
        cmd += `${random_number(parseInt(event.target.getAttribute("data-random-min")), parseInt(event.target.getAttribute("data-random-max")))}`;

    let suffix = "";
    cmd = (GM_config.get("prevent_shadowban") ? `${suffix}${randomize_case(cmd)}` : `${suffix}${cmd}`).trim();

    if(cmd.trim() !== "" && cmd !== null)
        if(GM_config.get("irc"))
            send_message_with_irc(cmd);
        else
            send_message_with_event(cmd);
    else
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Please contact script creator, this button doesn't seem to work correctly!",
            theme: "dark",
            backdrop: false
        });
}

function insert_voucher_buttons(html) {
    wait_for_element(".chat-input__buttons-container").then(async () => {
        html = `<div class="k-store-buttongroups"><div class="k-buttongroup">${html}</div></div>`;
        document.querySelector(".chat-input")?.insertAdjacentHTML("afterend", html);

        let buttons = document.querySelectorAll(".k-get_voucher_button");
        buttons.forEach(button => {
            button.addEventListener("click", async event => {
                let voucher = event.target.getAttribute("voucher");
                let repeats = event.target.getAttribute("data-repeats");

                if (repeats !== null && repeats > 1)
                    await bulk_purchase_product(voucher, parseInt(repeats));
                else
                    await purchase_voucher(event);
            }, false);
        });
    });
}

function generate_voucher_button(voucher, text, options = {}) {
    const { classes = "", repeats = null } = options

    let base_class = "k-actionbutton k-get_voucher_button"
    let combined_classes = (base_class + ` ${classes ?? ""}`).trim()
    let attributes = `voucher="${voucher}" class="${combined_classes}"`

    if (repeats !== null) attributes += ` data-repeats="${repeats}"`

    return `<button ${attributes}>${text}</button>`
}

function btngrp_label(label) {
    return `<label class="k-buttongroup-label">${label}</label>`;
}

function lblgrp_label(btn_menu, name, classes="") {
    return `<label class="k-selection-label ${classes}" data-btn-menu="${btn_menu}">${name}</label>`;
}

function btngrp_button(cmd, text, options = {}) {
    const { classes = "", targets = null, random_min = null, random_max = null } = options;

    let base_class = targets !== null ? "k-targetbutton" : "k-actionbutton";
    let combined_classes = (base_class + ` ${classes ?? ""}`).trim();
    let attributes = `cmd="${cmd}" class="${combined_classes}"`;
    if (targets !== null) attributes += ` data-targets="${targets}"`;
    if (random_min !== null && random_max !== null) attributes += ` data-random-min="${random_min}" data-random-max="${random_max}"`;
    return `<button ${attributes}>${text}</button>`;
}

function show_btn_menu(event) {
    let btn_menus = document.querySelectorAll(".k-btn-menu");
    let label_group = event.target.closest(".k-labelgroup");
    let close_button = label_group.querySelector(`label[data-btn-menu="close"]`);

    btn_menus.forEach(el => {
        el.getAttribute("data-btn-menu") === event.target.getAttribute("data-btn-menu") ? el.classList.remove("k-hidden") : el.classList.add("k-hidden");
    });

    let all_hidden = Array.from(btn_menus).every(el => el.classList.contains("k-hidden"));
    all_hidden ? close_button.classList.add("k-hidden") : close_button.classList.remove("k-hidden");
}

// ========================
// Draggable Container
// ========================

function make_draggable() {
    const container = document.querySelector("#k-main-container");
    const make_draggable_button = document.querySelector("#k-make-draggable-button");
    const grab_handle = document.querySelector("#k-grab-handle");
    const pin_button = document.querySelector("#k-pin-button");

    if (container && make_draggable_button && grab_handle && pin_button) {
        // Add the "draggable" class
        container.classList.add("k-draggable");

        // Hide the make-draggable button and show the k-grab-handle and pin button
        make_draggable_button.classList.add("k-hidden");
        grab_handle.classList.remove("k-hidden");
        pin_button.classList.remove("k-hidden");

        // Save the initial position of the container relative to the viewport
        const initial_rect = container.getBoundingClientRect();
        const left = initial_rect.left;
        const bottom = initial_rect.bottom;

        // Move the container to the body (to ensure it's above other elements)
        document.body.appendChild(container);

        // Set the initial position using transform
        container.style.transform = `translate(${left}px, ${window.innerHeight - bottom}px)`;

        // Enable dragging only when the k-grab-handle is clicked
        interact(grab_handle).draggable({
            listeners: {
                move(event) {
                    const target = container;
                    const rect = target.getBoundingClientRect();
                    const window_width = window.innerWidth;
                    const window_height = window.innerHeight;

                    // Calculate new position based on mouse movement
                    let x = rect.left + event.dx;
                    let y = rect.bottom - container.offsetHeight + event.dy;

                    // Round x and y to prevent jitter caused by subpixel values
                    x = Math.round(x);
                    y = Math.round(y);

                    // Constrain the position to keep the container within the window bounds
                    x = Math.max(0, Math.min(x, window_width - rect.width)); // Left and right edges
                    y = Math.max(50, Math.min(y, window_height - container.offsetHeight)); // Top and bottom edges

                    // Update the container's position using transform
                    target.style.transform = `translate(${x}px, ${y}px)`;
                }
            }
        });
    }
}

function disable_draggable() {
    const container = document.querySelector("#k-main-container");
    const make_draggable_button = document.querySelector("#k-make-draggable-button");
    const grab_handle = document.querySelector("#k-grab-handle");
    const pin_button = document.querySelector("#k-pin-button");

    if (container && make_draggable_button && grab_handle && pin_button) {
        // Remove the "draggable" class
        container.classList.remove("k-draggable");

        // Disable dragging
        interact(grab_handle).draggable(false);

        // Reset the container to its original position
        container.style.transform = "translate(0px, 0px)";
        container.setAttribute("data-x", 0);
        container.setAttribute("data-y", 0);

        // Move the container back to the chat panel
        document.querySelector(".chat-input")?.insertAdjacentElement("beforebegin", container);

        // Show the make-draggable button and hide the k-grab-handle and pin button
        make_draggable_button.classList.remove("k-hidden");
        grab_handle.classList.add("k-hidden");
        pin_button.classList.add("k-hidden");
    }
}

// ========================
// Notifications
// ========================

function observe_chat_for_username_mentions() {
    wait_for_element(".chat-scrollable-area__message-container").then(async () => {
        const chat_container = document.querySelector(".chat-scrollable-area__message-container");
        await sleep_s(5);

        if(username && username != "") {
            // Create a MutationObserver to watch for new messages
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        // Check if the added node is a chat message
                        let msg = node.querySelector(`span[data-a-target="chat-line-message-body"]`)?.innerText?.trim();
                        if (msg && msg.toLowerCase().includes(username.toLowerCase())) {
                            let author = node.querySelector(`.chat-author__display-name`)?.textContent;
                            GM_notification({
                                title: `Channel: ${twitch_channel} - ${author} mentioned you!`,
                                text: `${msg}`,
                                timeout: 15000,
                                silent: false
                            });
                        }
                    });
                });
            });

            // Start observing the chat container for new child nodes
            observer.observe(chat_container, {
                childList: true, // Watch for added or removed child nodes
                subtree: true, // Watch all descendants of the container
            });
        }
    });
}

// ========================
// Collect Point Bonus
// ========================

async function collect_point_bonus() {
    await wait_for_element(".claimable-bonus__icon").then(async () => {
        document.querySelector(".claimable-bonus__icon")?.click();
        console.log("BONUS CLICKED");
        await sleep_m(10);
        collect_point_bonus();
    });
}

// ========================
// Twitch Store Observer
// ========================

async function twitch_store_observer() {
    // Helper function that detects if the item page is opened
    const selector = "#channel-points-reward-center-body > .reward-center-body > div:not(.rewards-list)";
    const container = await wait_for_element(selector);

    if (container.querySelector(".reward-icon__image")) {
        if(GM_config.get("clickable_links_in_description"))
            clickable_links_in_description(container);

        if (GM_config.get("bulk_purchase_panel"))
            insert_twitch_store_amount_panel(container);
    }

    // Wait till panel disappears
    await wait_for_element_to_disappear(selector);
    twitch_store_observer();
}

// ========================
// Clickable links in description
// ========================

function clickable_links_in_description(container) {
    const desc = container.querySelector("p"); // Get the first <p> element

    if (desc?.querySelector("a"))
        return; // Skip if there are already <a> elements

    const url_regex = /https?:\/\/[^\s]+/g; // Simple URL detection
    const original_text = desc.textContent;

    if (!url_regex.test(original_text))
        return; // Skip if there are no URLs

    // Replace URLs with clickable <a> tags
    const html_with_links = original_text.replace(url_regex, url => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    desc.innerHTML = html_with_links;
}

// ========================
// Bulk Twitch Store Purchase UI
// ========================

function insert_twitch_store_amount_panel(container) {
    if(!document.querySelector(".k-twitch-store-amount-panel")) {
        // console.log("insert_twitch_store_amount_panel: Inserting panel.");

        // HTML as a complete string → Amount panel + button for bulk purchase
        let html = `
            <div class="k-twitch-store-amount-panel">
                <button type="button" id="k-twitch-store-amount-decrease">-</button>
                <input type="number" id="k-twitch-store-amount-value" value="1" min="1" max="100">
                <button type="button" id="k-twitch-store-amount-increase">+</button>
                <button type="button" id="k-twitch-store-bulk-purchase" class="k-twitch-store-cart-button" title="Start bulk purchase">🛒</button>
            </div>
        `;

        // Insert HTML after 2nd child
        if (container.children.length >= 2)
            container.children[1].insertAdjacentHTML("afterend", html);
        else
            return;

        // Event Listeners
        const input = document.getElementById("k-twitch-store-amount-value");
        const btn_decrease = document.getElementById("k-twitch-store-amount-decrease");
        const btn_increase = document.getElementById("k-twitch-store-amount-increase");
        const bulk_button = document.getElementById("k-twitch-store-bulk-purchase");

        btn_decrease.addEventListener("click", () => on_decrease_click(input));
        btn_increase.addEventListener("click", () => on_increase_click(input));
        input.addEventListener("input", () => on_input_change(input));

        // Bulk Purchase Button → Event
        bulk_button.addEventListener("click", async () => {
            let amount = parseInt(input.value);
            if (isNaN(amount) || amount < 1) amount = 1;
            else if (amount > 100) amount = 100;

            const product = document.querySelector("#channel-points-reward-center-header > div > p").innerHTML;
            bulk_purchase_product(product, amount);
        });
    }
}

function on_decrease_click(input) {
    let value = parse_int_safe(input.value, 1);
    value = Math.max(1, value - 1);
    input.value = value;
}

function on_increase_click(input) {
    let value = parse_int_safe(input.value, 1);
    value = Math.min(100, value + 1);
    input.value = value;
}

function on_input_change(input) {
    let value = parseInt(input.value);
    if (isNaN(value) || value < 1)
        value = 1;
    else if (value > 100)
        value = 100;
    input.value = value;
}

function parse_int_safe(str, fallback) {
    const value = parseInt(str);
    return isNaN(value) ? fallback : value;
}

// ========================
// Purchase Functions
// ========================

async function purchase_voucher(trigger) {
    let voucher = trigger.target.attributes.voucher.value;
    let storebutton = document.querySelector(".community-points-summary button");
    storebutton.click();
    wait_for_element(".rewards-list").then(async () => { // Wait till rewards list is showing
        let rewards = document.querySelector(".rewards-list");
        let reward = rewards.querySelector(`img[alt="${voucher}"]`);
        if(reward) { // Open the voucher buy menu
            reward.click();
            wait_for_element(".reward-center-body button.ScCoreButton-sc-ocjdkq-0").then(async () => { // Wait till voucher item is showing
                let reward_redeem_button = document.querySelector(".reward-center-body button.ScCoreButton-sc-ocjdkq-0");
                if(reward_redeem_button.disabled == false)
                    reward_redeem_button.click();
                else {
                    storebutton.click();
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Reward not available, maybe you reached maximum amount of claims for this stream or you don't have enough channel points!",
                        theme: "dark",
                        backdrop: false
                    });


                }
            });
        }
        else
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Reward not found maybe they are disabled at the moment, if not than please contact script creator via Discord!",
                theme: "dark",
                backdrop: false
            });
    });
}

async function bulk_purchase_product(product, amount) {
    let storebutton = document.querySelector(".community-points-summary button");
    let success_count = 0;

    Swal.fire({
        title: `Purchasing "${product}"...`,
        html: `<progress value="0" max="${amount}"></progress><br>0/${amount}`,
        icon: "info",
        theme: "dark",
        backdrop: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });

    for (let i = 0; i < amount; i++) {
        storebutton.click();

        try {
            await wait_for_element(".rewards-list");
            let rewards = document.querySelector(".rewards-list");
            let reward = rewards.querySelector(`img[alt="${product}"]`);

            if (reward) {
                reward.click();
                await wait_for_element(".reward-center-body button.ScCoreButton-sc-ocjdkq-0");

                let reward_redeem_button = document.querySelector(".reward-center-body button.ScCoreButton-sc-ocjdkq-0");

                if (reward_redeem_button.disabled == false) {
                    reward_redeem_button.click();
                    success_count++;
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: `Reward not available anymore! Process stopped after ${success_count} successful purchases.`,
                        theme: "dark",
                        backdrop: false
                    });
                    storebutton.click();
                    return;
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Reward "${product}" not found! Process stopped.`,
                    theme: "dark",
                    backdrop: false
                });
                storebutton.click();
                return;
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `Unexpected error occurred. Process stopped after ${success_count} successful purchases.`,
                theme: "dark",
                backdrop: false
            });
            storebutton.click();
            return;
        }

        // Update Progress Bar
        Swal.update({
            html: `<progress value="${i + 1}" max="${amount}"></progress><br>${i + 1}/${amount}`
        });

        await wait_for_element_to_disappear(".reward-center-body button.ScCoreButton-sc-ocjdkq-0");
    }

    Swal.fire({
        title: "Done!",
        text: `${success_count}/${amount} "${product}" purchased successfully.`,
        icon: "success",
        theme: "dark",
        backdrop: false
    });
}

// ========================
// Restart Timer by Zosky
// ========================

async function zoskys_restart_timer(mst) {
    let max_stream_time = mst;
    let update_interval = 2; // Initial interval: 2 second

    let time_element = null;
    let timer_element = null;

    create_timer_element();
    await start_timer();

    // Function to calculate the remaining time (only hours and minutes)
    function calculate_time_left(seconds, max_stream_time) {
        let time_left = max_stream_time - seconds;
        let h = Math.floor(time_left / 3600);
        let m = Math.floor((time_left % 3600) / 60);

        // Format the time (only hours and minutes)
        return {
            hours: h < 10 ? `0${h}` : h,
            minutes: m < 10 ? `0${m}` : m,
        };
    }

    // Function to create the timer element if it doesn't exist
    function create_timer_element() {
        if (!timer_element) {
            wait_for_element("section > div").then(async () => {
                const infobox = document.querySelector(".channel-info-content");
                const timer_html = `
                <div id="time_left" style="width: 100%; text-align: center; font-size: x-large; background: purple;">
                    Waiting for stream time...
                </div>
                `;
                infobox.insertAdjacentHTML("afterbegin", timer_html);
                timer_element = document.getElementById("time_left"); // Update reference
            });
        }
    }

    // Function to update the timer in the DOM
    async function update_timer() {
        try {
            // Try to find the .live-time element if not already found
            if (!time_element) {
                time_element = document.querySelector(".live-time");
                if (!time_element) return false; // Element not found
            }

            // Extract the time from the nested <span> or <p> tag
            const time_text = time_element.querySelector("span, p").textContent.trim();
            // Extract the time parts (HH:MM:SS)
            const time_parts = time_text.split(":").map(Number);

            // Handle only HH:MM:SS format
            if (time_parts.length === 3 && !time_parts.some(isNaN)) {
                const [hours, minutes, seconds] = time_parts;
                const total_seconds = hours * 3600 + minutes * 60 + seconds;

                // Calculate and update the timer (only hours and minutes)
                const { hours: h, minutes: m } = calculate_time_left(total_seconds, max_stream_time);

                // Update the timer element
                timer_element.innerHTML = `Approx ${h}:${m} till stream restart for vouchers`;
                return true; // Element found and updated
            } else {
                return false; // Invalid format
            }
        } catch (error) {
            console.error("Error updating timer:", error);
            return false; // Error occurred
        }
    }

    // Start the timer with dynamic intervals
    async function start_timer() {
        await wait_for_element(".live-time").then(async () => {
            time_element = document.querySelector(".live-time");
            update_interval = 50; // Switch to 50-second interval
        });

        while (true) {
            // Try to update the timer
            const element_found = await update_timer();

            // If update_timer returns false, break the loop
            if (!element_found) break;

            // Wait for the specified interval
            await sleep_s(update_interval);
        }
        console.log("Timer stopped due to an error or invalid format.");
    }
}

// ========================
// CSS Styles
// ========================

function hide_powerups() {
    GM_addStyle(`
        .rewards-list > div:first-of-type,
        .rewards-list [class*="bitsRewardListItem"] {
            display: none !important;
        }

        .rewards-list > div {
            padding-top: 0 !important;
        }
    `);
}

GM_addStyle(`
#configuration {
    padding: 20px !important;
    max-height: 600px !important;
    max-width: 500px !important;
    background: inherit !important;
}

#configuration * {
    background: inherit;
    color: inherit;
}

#configuration .section_header {
    margin-bottom: 10px !important;
}

#configuration input {
    margin-right: 10px;
}

#configuration input[type="text"] {
    display: block;
}

#configuration textarea {
    width: 100%;
    min-height: 70px;
    resize: vertical;
}

#configuration_resetLink {
    color: var(--color-text-base) !important;
}

.k-actionbutton,
.k-targetbutton,
#configuration_saveBtn,
#configuration_closeBtn {
    padding: 10px;
    background-color: var(--color-background-button-primary-default);
    color: var(--color-text-button-primary);
    display: inline-flex;
    position: relative;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    overflow: hidden;
    text-decoration: none;
    text-decoration-color: currentcolor;
    white-space: nowrap;
    user-select: none;
    font-weight: var(--font-weight-semibold);
    font-size: 13px;
    height: var(--button-size-default);
    border-radius: var(--input-border-radius-default);
}

.k-main-container {
    min-width: 300px;
    position: relative;
    background: inherit;
    border-top: 2px solid var(--color-background-button-primary-default);
}

.k-main-container.k-draggable {
    border: 2px solid var(--color-background-button-primary-default);
    position: absolute;
    z-index: 100;
 }

.k-store-buttongroups {
    padding: 0px 15px 15px;
}

.k-buttongroups {
    padding: 25px 15px 15px;
}

.k-buttongroup {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.k-buttongroup-label {
    font-size: 13px;
}

.k-labelgroup {
    margin-top: 5px;
    font-size: 17px;
    gap: 25px;
    display: flex;
}

.k-hidden {
    display: none;
}

#k-streamelements_points {
    font-size: 12px;
    position: absolute;
    left: 5px;
    top: 5px;
}

#k-streamelements_points .k-points_added {
    color: green;
}

#k-streamelements_points .k-points_subtracted {
    color: red;
}

#k-panel-buttons {
    position: absolute;
    top: 5px;
    right: 5px;
    user-select: none;
    font-size: 16px;
    display: grid;
    gap: 5px;
    grid-auto-flow: column;
}

#k-pin-button,
#k-make-draggable-button,
#k-cart-button,
#k-open-settings {
    cursor: pointer;
}

#k-grab-handle {
    cursor: grab;
}

.k-grid-1 { display: grid; grid-template-columns: repeat(1, min-content); }
.k-grid-2 { display: grid; grid-template-columns: repeat(2, min-content); }
.k-grid-3 { display: grid; grid-template-columns: repeat(3, min-content); }
.k-grid-4 { display: grid; grid-template-columns: repeat(4, min-content); }
.k-grid-5 { display: grid; grid-template-columns: repeat(5, min-content); }
.k-grid-6 { display: grid; grid-template-columns: repeat(6, min-content); }
.k-grid-7 { display: grid; grid-template-columns: repeat(7, min-content); }
.k-grid-8 { display: grid; grid-template-columns: repeat(8, min-content); }

.k-twitch-store-amount-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: 2px solid var(--color-twitch-purple);
    border-radius: 8px;
    margin-top: 10px;
    font-weight: bold;
    background: rgba(0,0,0,0.1);
}

.k-twitch-store-amount-panel button {
    padding: 6px 10px;
    font-size: 16px;
    cursor: pointer;
}

.k-twitch-store-amount-panel input[type="number"] {
    width: 30px;
    text-align: center;
    font-size: 16px;
    background: none;
    border: none;
    color: inherit;
    -webkit-appearance: none;
    -moz-appearance: textfield;
}

.k-twitch-store-amount-panel input[type="number"]:focus-visible {
    outline: none;
}

.k-twitch-store-cart-button {
    border-left: 2px solid var(--color-twitch-purple);
}
`);