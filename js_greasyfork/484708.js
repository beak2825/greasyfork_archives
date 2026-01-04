// ==UserScript==
// @name        ER4U - Smart Image Associator
// @namespace   https://greasyfork.org/en/users/781076-jery-js
// @version     1.1.2
// @description Automatically search for images for each product and let user select the best image to associate with the product
// @icon        https://er4uenterpriseplus.in/er4u/jeshmargin/img/f.jpg
// @author      Jery
// @license     MIT
// @match       https://er4uenterpriseplus.in/er4u/jeshmargin/combination_list.php
// @match       https://er4uenterpriseplus.in/er4u/jeshmargin/catalog_category_map.php?&comid=*
// @require     https://unpkg.com/axios/dist/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/484708/ER4U%20-%20Smart%20Image%20Associator.user.js
// @updateURL https://update.greasyfork.org/scripts/484708/ER4U%20-%20Smart%20Image%20Associator.meta.js
// ==/UserScript==

/************************
 * SETTINGS
 ************************/
const serviceId = 1;


/***************************************************************
 * Helper sub-script to set image url in a new tab
 ***************************************************************/
if (window.location.href.includes("catalog_category_map.php?&comid=")) {
    if (window.location.href.includes("&message=success")) {
        window.close();
    }
    else if (window.location.href.includes("&new_img_url=")) {
        setTimeout(() => {
            // goto img url tab
            document.querySelector("#nav-img-url-tab").click();
            // add img url
            document.querySelector("#tab_tab > tbody").lastElementChild.querySelector('input').value = window.location.href.split("&new_img_url=")[1];
            // click plus button
            document.querySelector("#add_row").click();
            // click save button
            setTimeout(() => {
                document.querySelector("#cForm button.btn-save-1").click();
            }, 1000);
        }, 1000);
    }
}


/***************************************************************
 * Initialize all buttons
 ***************************************************************/
if (window.location.href.includes("combination_list.php")) {
    const generateBtnArea = document.querySelector("thead:nth-child(1) > tr");
    
    // Associate Images Button
    const associateImagesBtn = document.createElement("a");
    associateImagesBtn.textContent = "Associate Images";
    associateImagesBtn.classList.add("text-primary");
    associateImagesBtn.style = "color: white; cursor: pointer;";
    associateImagesBtn.addEventListener("click", () => displayForm());
    generateBtnArea.appendChild(document.createElement("td")).appendChild(associateImagesBtn);
    // generateBtnArea.innerHTML += `<td><a id="ClearZeroQtyBtn" style="color: white; cursor: pointer;">Clear 0 Qty</a></td>`;

    // Clear 0 qty Button
    const clearZeroQtyBtn = document.createElement("a");
    clearZeroQtyBtn.textContent = "Clear 0 Qty";
    clearZeroQtyBtn.classList.add("text-primary");
    clearZeroQtyBtn.style = "color: white; cursor: pointer;";
    clearZeroQtyBtn.addEventListener("click", () => {
        console.log("Clearing 0 Qty");
        const zeroQtyRows = document.querySelectorAll(`#item-list td:nth-child(31)`);
        zeroQtyRows.forEach((row) => {
            if (row.textContent.trim() == "0") row.parentElement.remove();
        });
    });
    generateBtnArea.appendChild(document.createElement("td")).appendChild(clearZeroQtyBtn);
}

/***************************************************************
 * Classes for handling various data like settings, products,
 * services and websites
 ***************************************************************/
class Product {
	constructor(id, name, barcode, hasImage) {
		this.id = id;
		this.name = name;
		this.barcode = barcode;
        this.hasImage = hasImage;
	}
}

class ProductList {
	constructor() {
		this.products = [];
	}

	addProduct(product) {
		this.products.push(product);
	}

    extractProducts() {
        const productRows = document.querySelectorAll("#item-list > tr:not(:last-child)");
        productRows.forEach((row) => {
            const id = row.querySelector(".cus_edit").href.split("comid=")[1];
            const name = row.querySelector("td:nth-child(6)").textContent;
            const barcode = row.querySelector("td:nth-child(4)").textContent;
            const hasImage = row.querySelector("td:nth-child(32) > a").textContent.trim() == "Y" ? true : false;
            this.addProduct(new Product(id, name, barcode, hasImage));
        });
        return this.products;
    }
}

class Image {
	constructor(title, original, thumbnail) {
        this.title = title;
		this.original = original;
		this.thumbnail = thumbnail;
	}
}

class ImageList {
	constructor() {
		this.images = [];
	}

	addImage(image) {
		this.images.push(image);
	}
}

const Services = [
	{
		name: "SerpAPI",
		icon: "https://www.google.com/favicon.ico",
		apiUrl: "https://serpapi.com/search.json?engine=google_images",
		async getImages(query) {
			const proxyUrl = "https://test.cors.workers.dev/?";
			const imageList = new ImageList();
            const apiKey = localStorage.getItem("serpapi_key");

            if (!apiKey) {
                const promptMessage = "Please enter your SerpAPI key:";
                const userInput = prompt(promptMessage);

                if (userInput && userInput.trim() !== "") {
                    localStorage.setItem("serpapi_key", userInput.trim());
                } else {
                    console.error("Invalid SerpAPI key");
                }
            }

            const api_key = localStorage.getItem("serpapi_key");
            const url = proxyUrl + this.apiUrl + `&api_key=${api_key}&q=${query}`;
			const response = await axios.get(url);

			const results = response.data["images_results"];
            console.log(results);
			results.forEach((result) => {
				const image = new Image(result["title"], result["original"], result["thumbnail"]);
				imageList.addImage(image);
			});

			return imageList.images;
		},
	},
    {
        name: "Google",
        icon: "https://www.google.com/favicon.ico",
        apiUrl: "https://www.googleapis.com/customsearch/v1?",
        async getImages(query) {
            const proxyUrl = "https://test.cors.workers.dev/?";
            const imageList = new ImageList();

            if (!localStorage.getItem("googleapi_key")) {
                const promptMessage = "Please enter your Google API key:";
                const userInput = prompt(promptMessage);

                if (userInput.length>10 && userInput.trim() !== "") {
                    localStorage.setItem("googleapi_key", userInput.trim());
                } else {
                    console.error("Invalid Google API Key");
                }
            }

            try {
                const api_key = localStorage.getItem("googleapi_key");
                const params = `cx=364fea58938af485a&searchType=image&key=${api_key}&q=${query}`;
                const url = this.apiUrl + params;
                const response = await axios.get(url);

                console.log(response.data);

                const results = response.data['items'];
                console.log(results);
                results.forEach((result) => {
                    imageList.addImage(new Image(
                        title = result["title"],
                        original = result["link"],
                        thumbnail = result["image"]["thumbnailLink"]
                    ));
                });

                return imageList.images;
            } catch (error) {
                alert("Error getting images for this item.\nTry manually, or goto next item.\n\n" + error);
            }
        },
    }
];

/***************************************************************
 * Functions for working of script
 ***************************************************************/
function displayForm() {
    const formOverlayId = 'SIA_FormOverlay';

    // Restore last overlay if it exists
    if (document.getElementById(formOverlayId)) {
        document.getElementById(formOverlayId).style.display = "flex";
        return;
    }

    // Create an overlay to cover the page
    const overlayDiv = document.createElement("div");
    overlayDiv.id = formOverlayId;
    overlayDiv.style.cssText =
        "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 999; display: flex; align-items: center; justify-content: center;";
    document.body.appendChild(overlayDiv);
    overlayDiv.onclick = (event) => (formDiv.contains(event.target) ? null : (overlayDiv.style.display = "none"));

    // Create a form to display the Images list
    const formDiv = document.createElement("div");
    formDiv.id = "SIA_Form";
    formDiv.style.cssText =
        "position:relative; height:80%; width:80%; color:#007a7a; background-color: rgba(228, 228, 228, 0.95); overflow:auto; border: groove rgb(75, 81, 84); border-radius: 16px; padding: 10px 5px; resize: both; scrollbar-width: thin; scrollbar-color: cyan transparent; display: flex; justify-content: center; align-items: center;";
    overlayDiv.appendChild(formDiv);

    // Extract products from page
    const products = new ProductList().extractProducts().filter((product) => !product.hasImage);
    console.log(products);

    let currentProductIndex = 0;

    // Create a container to display the product
    const productContainer = document.createElement("div");
    productContainer.id = "SIA_ProductContainer";
    formDiv.appendChild(productContainer);

    // Function to update the product card
    function updateProductCard() {
        productContainer.innerHTML = "";
        productContainer.appendChild(generateProductCard(products[currentProductIndex]));
    }

    // Create a Div in top right of form for navigation buttons
    const navigationDiv = document.createElement("div");
    navigationDiv.id = "SIA_NavigationDiv";
    navigationDiv.style.cssText = "position: absolute; top: 10px; right: 10px; display: flex; justify-content: space-between; width: 230px;";

    // Add Custom Link Butotn to the navigation div
    const customLinkBtn = document.createElement("div");
    customLinkBtn.title = 'Set Custom Image Link';
    customLinkBtn.innerHTML = "&#x1F517;"; // Link symbol unicode
    customLinkBtn.style.cssText = "font-size: 30px; cursor: pointer; background-color: #007a7a; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; justify-content: center; align-items: center;";
    customLinkBtn.addEventListener("click", () => {
        const imgLink = prompt('Enter Image URL (jpg, png, webp)');
        if (imgLink) {
            setProductImage(products[currentProductIndex].id, imgLink);
            setTimeout(() => {
                if (document.getElementById("SIA_AutoNextCheckbox").checked) {
                    document.getElementById('SIA_nextProduct').click();
                }
            }, 1000);
        }
    });

    // Add big left arrow to the navigation div
    const leftArrow = document.createElement("div");
    leftArrow.id = 'SIA_prevProduct';
    leftArrow.innerHTML = "&#x2190;"; // Left arrow unicode
    leftArrow.style.cssText = "font-size: 50px; cursor: pointer; background-color: #007a7a; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; justify-content: center; align-items: center;";
    leftArrow.addEventListener("click", () => {
        currentProductIndex = (currentProductIndex - 1 + products.length) % products.length;
        updateProductCard();
    });

    // Add big right arrow to the navigation div
    const rightArrow = document.createElement("div");
    rightArrow.id = 'SIA_nextProduct';
    rightArrow.innerHTML = "&#x2192;"; // Right arrow unicode
    rightArrow.style.cssText = "font-size: 50px; cursor: pointer; background-color: #007a7a; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; justify-content: center; align-items: center;";
    rightArrow.addEventListener("click", () => {
        currentProductIndex = (currentProductIndex + 1) % products.length;
        updateProductCard();
    });

    // Append the arrows to the Navigation div
    navigationDiv.appendChild(customLinkBtn);
    navigationDiv.appendChild(leftArrow);
    navigationDiv.appendChild(rightArrow);

    // Add checkbox for auto go to next product
    const autoNextCheckbox = document.createElement("input");
    autoNextCheckbox.type = "checkbox";
    autoNextCheckbox.id = "SIA_AutoNextCheckbox";
    autoNextCheckbox.checked = true;
    autoNextCheckbox.style.cssText = "cursor: pointer; position: absolute; right: 210px; top: 80px;";
    const autoNextLabel = document.createElement("label");
    autoNextLabel.htmlFor = "SIA_AutoNextCheckbox";
    autoNextLabel.textContent = "Automatically Go to Next Product";
    autoNextLabel.style.cssText = "margin-left: 5px; position: absolute; top: 80px; right: 10px;";

    // Attach the arrows and checkbox to the formDiv as siblings
    formDiv.appendChild(autoNextCheckbox);
    formDiv.appendChild(autoNextLabel);
    formDiv.appendChild(navigationDiv);

    // Initial update of the product card
    updateProductCard();
}

function generateProductCard(product) {
    console.log(product.name);
    
    const card = document.createElement("div");
    card.id = `product_card_${product.id}`;
    card.style.cssText = `border-radius:24px; box-shadow:0 2px 8px; padding:16px; margin:32px; display:flex; flex-direction:column;`;
    card.classList.add("product-card");

    // Title
    const title = document.createElement("h1");
    title.textContent = `${product.id.toString().padStart(3, '0')}:  ${product.name}`;
    title.style.cursor = "pointer";
    title.addEventListener("mouseover", function () { this.style.textDecoration = "underline"; });
    title.addEventListener("mouseout", function () { this.style.textDecoration = "none"; });
    title.addEventListener("click", () => {
        const text = prompt('', title.textContent);
        if (text) {
            title.textContent = text;        
            loadImagesIntoContainer(title.textContent + '  product image', product);
        }
    });
    
    
    card.appendChild(title);
    
    // Barcode
    const subTitle = document.createElement("h2");
    subTitle.textContent = `Barcode: ${product.barcode}`;
    card.appendChild(subTitle);

    // Image Rows
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");

    // Create two rows of placeholder images
    for (let i = 0; i < 2; i++) {
        const row = document.createElement("div");
        row.classList.add("image-row");

        // Add three placeholder images to each row
        for (let j = 0; j < 4; j++) {
            const image = document.createElement("img");
            image.src = "https://media.tenor.com/v_OKGJFSkOQAAAAM/loading-gif.gif";
            image.style.cssText = `width:200px; height:200px; border-radius: 8px; margin:5px; transition:0.3s; cursor:pointer; object-fit: cover;`;
            image.classList.add("product-image");
            row.appendChild(image);
        }

        imageContainer.appendChild(row);
    }

    card.appendChild(imageContainer);

    // Get Images from API and update the image container in the background
    const barcode = product.barcode.length > 7 ? product.barcode : '';
    const query = `${barcode}  ${product.name}  product image png`.trim();
    loadImagesIntoContainer(query, product);

    // Return the card immediately, and the images will update when they're loaded
    return card;
}

function loadImagesIntoContainer(query, product) {
    // Turn images into placeholders
    document.querySelectorAll(".image-row > img").forEach(image => {
        image.src = "https://media.tenor.com/v_OKGJFSkOQAAAAM/loading-gif.gif";
    });
    const service = Services[serviceId];
    service.getImages(query).then(images => updateImageContainer(images, product));
}

function updateImageContainer(images, product) {
    const imageContainer = document.querySelector('.image-container');
    const allImages = imageContainer.querySelectorAll(".product-image");
    for (let i = 0; i < allImages.length; i++) {
        allImages[i].src = images[i].thumbnail;
        allImages[i].title = images[i].title + '\n' + images[i].original;

        // Add hover animation
        allImages[i].addEventListener("mouseover", function() {
            this.style.transform = "scale(1.1)";
        });
        allImages[i].addEventListener("mouseout", function() {
            this.style.transform = "scale(1)";
        });

        // Add click event
        allImages[i].addEventListener("click", function() {
            console.log(images[i].original);
            setProductImage(product.id, images[i].original);

            setTimeout(() => {
                if (document.getElementById("SIA_AutoNextCheckbox").checked) {
                    document.getElementById('SIA_nextProduct').click();
                }
            }, 1000);

            // Remove shadow from all images
            const allImages = document.querySelectorAll(".product-image");
            allImages.forEach(img => img.style.boxShadow = "");

            // Add shadow to clicked image
            this.style.boxShadow = "0 0 10px";
        });
    }
}

function setProductImage(id, imageLink) {
    let cleanedImageLink = imageLink.replace(/(\.jpeg|\.jpg|\.png).*/, '$1');
    if (!/\.(jpeg|jpg|png)$/.test(cleanedImageLink)) {
        alert("Invalid image URL. Please provide a URL ending with .jpeg, .jpg, or .png");
        return;
    }
    const url = `https://er4uenterpriseplus.in/er4u/jeshmargin/catalog_category_map.php?&comid=${id}&new_img_url=` + cleanedImageLink
    // window.open(url, '_blank', 'noopener,noreferrer');
    let associationWindow = window.open(url,null,"height=10,width=10,status=yes,toolbar=no,scrollbars=yes,menubar=no,location=no")

    // Set the item's image state to 'Y' in the products list using id
    const productRow = document.querySelector(`[href="image_view.php?comid=${id}"]`);
    productRow.textContent = "Y ";
    productRow.style.color = "blue";

    setTimeout(() => {
        associationWindow.close();
    }, 10000);
}