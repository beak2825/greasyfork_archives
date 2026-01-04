class LightboxModern {
  _swipeStartX = null;
  _swipeStartY = null;
  _swipeEndX = null;
  _swipeEndY = null;
  _clickTimeStart = null;
  _clickTimeEnd = null;

  // Tentukan threshold untuk dianggap sebagai swipe
  _THRESHOLD = 20;
  _CLICK_TIME_THRESHOLD = 100;
  _currentImage = null;

  _progress = 1
  _idFadeOutTool = null;

  constructor(container, { images = [] } = {}) {
    this.container = container;
    this.container.classList.add("LightboxModern", "FadeIn")
    this.container.innerHTML = ""

    this.progress = this._renderProgress();
    this.container.append(this.progress);

    this.images = images
    const imagesContainer = this._renderListImage(images);
    this.container.append(imagesContainer)

    this._updateProgress()

    // this.swiper = this._SwipeListener()
    // this.container.append(this.swiper)

    this.tool = this._RenderTool()
    this.container.append(this.tool)
  }

  _renderListImage(images) {
    const container = document.createElement("div");
    container.classList.add("ImagesContainer");
    this._listenSwipe(container)

    for(const index in images) {
      const wrapper = document.createElement("div");
      wrapper.classList.add("ImageWrapper");

      if(index == 0) {
        wrapper.classList.add("FadeIn")
        this._currentImage = wrapper;
      }

      const imgElement = document.createElement("img");
      imgElement.src = images[index];
      imgElement.alt = `Images Number ${index + 1}`;

      const padding = document.createElement("div")
      padding.classList.add("ImagePadding");

      wrapper.append(imgElement, padding)
      container.append(wrapper)
    }

    return container;
  }

  _renderProgress() {
    const container = document.createElement("div");
    container.classList.add("Progress");
    
    return container;
  }
  
  _updateProgress() {
    this.progress.style.width = `${Math.floor(this._progress / this.images.length * 100)}%`
  }

  _SwipeListener() {
    const container = document.createElement("div");
    container.classList.add("Swiper")
    _listenSwipe

    return container;
  }

  _listenSwipe(element) {
    element.addEventListener("touchstart", (e) => {
      this._clickTimeStart = new Date().getTime()
      this._swipeStartX = e.touches[0].clientX;
      this._swipeStartY = e.touches[0].clientY;
    })

    element.addEventListener("touchmove", (e) => {
      if(e.touches.length === 1) {
        e.preventDefault(); // Mencegah scroll selama swipe
        this._swipeEndX = e.touches[0].clientX;
        this._swipeEndY = e.touches[0].clientY;
      }
    })

    element.addEventListener("touchend", (e) => {
      this._clickTimeEnd = new Date().getTime()
      this._detectSwipe()
    })
  }

  _RenderTool() {
    const container = document.createElement("div");
    container.classList.add("LightboxTool")
    this._listenSwipe(container)

    const header = document.createElement("div");
    header.classList.add("ToolHeader")

    const closeButton = document.createElement("button")
    closeButton.classList.add("btn")
    closeButton.innerText = "Close"

    closeButton.addEventListener("click", () => {
      this.container.classList.remove("FadeIn")
    })

    const fullScreenButton = document.createElement("button")
    fullScreenButton.classList.add("btn")
    fullScreenButton.innerText = "[ ]"
    fullScreenButton.onclick = () => {
      if(document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        document.documentElement.requestFullscreen()
      }
    }

    header.append(fullScreenButton, closeButton)

    const footer = document.createElement("div")
    footer.classList.add("ToolFooter")

    const downloadImage = document.createElement("button")
    downloadImage.classList.add("btn")
    downloadImage.innerText = "Download Image"
    downloadImage.onclick = () => this.downloadImage(this._currentImage.querySelector("img").src)

    const downloadAllImage = document.createElement("button")
    downloadAllImage.classList.add("btn")
    downloadAllImage.innerText = "Download All Image"
    downloadAllImage.onclick = () => {
      downloadAllImage.disabled = true;
      for(const image of this.images) {
        this.downloadImage(image)
      }
      downloadAllImage.disabled = false;
    }

    footer.append(downloadImage, downloadAllImage)

    container.append(header, footer);
    container.addEventListener("click", () => {
      container.classList.toggle("FadeIn")
    })

    return container
  }

  _fadeOutImage() {
    if(this._currentImage) this._currentImage.classList.remove("FadeIn")
  }

  _nextImage() {
    const nextElement = this._currentImage.nextElementSibling;
    
    this._fadeOutImage();

    if( nextElement ) {
      nextElement.classList.add("FadeIn")
      this._currentImage = nextElement;
      this._progress += 1
    } else {
      const currentImage = this.container.querySelector(".ImagesContainer .ImageWrapper");
      currentImage.classList.add("FadeIn")
      this._currentImage = currentImage;
      this._progress = 1
    }
  }

  _prevImage() {
    const prevElement = this._currentImage.previousElementSibling;
    
    this._fadeOutImage()
    if(prevElement) {
      prevElement.classList.add("FadeIn")
      this._currentImage = prevElement;
      this._progress -= 1
    } else {
      const currentImage = this.container.querySelector(".ImagesContainer").lastElementChild
      currentImage.classList.add("FadeIn")
      this._currentImage = currentImage;
      this._progress = this.images.length
    }
  }

  _detectSwipe() {
    const deltaX = this._swipeEndX - this._swipeStartX;
    const deltaY = this._swipeEndY - this._swipeStartY;
    const deltaTime = this._clickTimeEnd - this._clickTimeStart

    if((Math.abs(deltaX) > this._THRESHOLD || Math.abs(deltaY) > this._THRESHOLD) && 
      deltaTime > this._CLICK_TIME_THRESHOLD) {
      if(deltaX > 0) {
        this._prevImage();
      } else {
        this._nextImage();
      }

      this._updateProgress()
    } else if(deltaTime < this._CLICK_TIME_THRESHOLD ) {
      this.tool.classList.toggle("FadeIn")
      
      if(this._idFadeOutTool) clearTimeout(this._idFadeOutTool)

      this._idFadeOutTool = setTimeout(() => this.tool.classList.remove("FadeIn") , 1500)
    } else {
      console.log('Tidak ada swipe yang terdeteksi.');
    }
  }

  downloadImage(url) {
    const link = document.createElement("a")
    link.href = url
    link.click()
  }
}