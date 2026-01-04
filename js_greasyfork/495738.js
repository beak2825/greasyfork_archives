$.fn.addDownloadBtn = function (
  text,
  className
) {
  var el = $(this);

  if (el.is("img")) {
    var tagLink = "<a>";
    var tagDiv = "<div>";

    var cssDiv = {
      display: "inline-block",
      position: "relative"
    };
    var cssLink = {
      position: "absolute",
      top: "10px",
      right: "10px"
    };

    var elDiv = $(tagDiv).css(cssDiv);

    var elImg = el.clone();
    var elImgSrc = el.attr("src");

    var elLink = $(tagLink)
      .attr("href", $("img").attr("src"))
      .attr("download", "")
      .text(text)
      .addClass(className)
      .css(cssLink);

    var all = elDiv.append(elImg).append(elLink);

    $("img").replaceWith(all);

    return elLink;
  }
};